'use client';


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope, Activity, ShieldAlert, ArrowRight, ArrowLeft,
  CheckCircle2, Loader2, Database, User, FileText,
  Utensils, Moon, AlertCircle, Zap, Coffee, Target, Scale,
  Pill, Wine, Droplets, Info, LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/app/components/Logo';

// --- FIREBASE & UTILS IMPORTS ---
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { auth, db } from '@/app/lib/firebase-config';
import { 
  saveUserToCookies, 
  getUserFromCookies, 
  clearUserCookies 
} from '@/app/lib/auth-cookies';

// --- FORM UI COMPONENTS ---

const InputField = ({ label, icon: Icon, error, ...props }) => (
  <div className="space-y-2">
    <label className="text-[var(--text-xs)] font-mono tracking-widest text-[#8E9BAE] uppercase flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3 text-[var(--color-accent)]" />} {label}
    </label>
    <div className="relative group">
      <input 
        className={`relative z-10 w-full bg-[var(--color-surface)] border ${error ? 'border-[var(--color-warning)]' : 'border-[var(--color-border)]'} text-[var(--color-text)] px-4 py-3 rounded-[var(--radius-control)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:text-[#8E9BAE]`}
        {...props} 
      />
    </div>
    {error && <span className="text-[var(--text-xs)] text-[var(--color-warning)] font-mono">{error}</span>}
  </div>
);

const SelectField = ({ label, icon: Icon, options, ...props }) => (
  <div className="space-y-2">
    <label className="text-[var(--text-xs)] font-mono tracking-widest text-[#8E9BAE] uppercase flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3 text-[var(--color-accent)]" />} {label}
    </label>
    <select 
      className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-3 rounded-[var(--radius-control)] font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer"
      {...props}
    >
      <option value="">Select option...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const AcidButton = ({ children, onClick, loading, disabled, variant = 'primary', className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    onClick={onClick}
    disabled={loading || disabled}
    type={onClick ? "button" : "submit"} // Auto-detect type
    className={`
      w-full py-4 rounded-[var(--radius-control)] font-mono text-[var(--text-xs)] font-bold uppercase tracking-widest transition-all
      flex items-center justify-center gap-2
      ${variant === 'primary'
        ? 'bg-[var(--color-accent)] text-black hover:opacity-90'
        : 'bg-transparent border border-[var(--color-border)] text-[#8E9BAE] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]'}
      ${(loading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}
  >
    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : children}
  </motion.button>
);

// --- AUTHENTICATION FLOW (FIREBASE INTEGRATED) ---

const AuthenticationFlow = ({ onAuthComplete }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        
        // Fetch extra data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        const userInfo = { 
          uid: user.uid,
          name: userData?.name || user.displayName || formData.email.split('@')[0], 
          email: user.email,
          surveyCompleted: userData?.surveyCompleted || false,
          surveyData: userData?.surveyData || null
        };
    
        saveUserToCookies(user.uid);
        onAuthComplete(userInfo);

      } else {
        // --- SIGNUP LOGIC ---
        // Validation
        if (formData.password !== formData.confirmPassword) throw new Error("Passwords do not match");
        if (formData.password.length < 6) throw new Error("Password must be 6+ chars");

        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: formData.name });

        // Initialize User Doc
        await setDoc(doc(db, 'users', user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          surveyCompleted: false
        });

        saveUserToCookies(user.uid);
        
        onAuthComplete({ 
          uid: user.uid,
          name: formData.name, 
          email: formData.email,
          surveyCompleted: false 
        });
      }
    } catch (err) {
      console.error("Auth Error:", err);
      // Map Firebase errors to UI messages
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') setError("INVALID CREDENTIALS");
      else if (err.code === 'auth/email-already-in-use') setError("EMAIL ALREADY REGISTERED");
      else if (err.code === 'auth/too-many-requests') setError("TOO MANY ATTEMPTS. PAUSE.");
      else setError(err.message.replace('Firebase:', '').toUpperCase());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-left">
          <Logo size="lg" />
          <p className="text-[#8E9BAE] font-mono text-[var(--text-xs)] tracking-widest">Drug-nutrient interaction checking for T2DM, hypertension, and CKD</p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-[var(--radius-card)] relative overflow-hidden shadow-[var(--shadow-card)]">
          
          <div className="flex gap-4 mb-8 bg-[var(--color-surface)] p-1 rounded-[var(--radius-control)]">
            <button 
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 rounded-[var(--radius-control)] text-[var(--text-xs)] font-mono font-bold tracking-widest transition-all ${isLogin ? 'bg-[var(--color-surface)] text-[var(--color-accent)]' : 'text-[#8E9BAE] hover:text-[var(--color-text)]'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 rounded-[var(--radius-control)] text-[var(--text-xs)] font-mono font-bold tracking-widest transition-all ${!isLogin ? 'bg-[var(--color-surface)] text-[var(--color-accent)]' : 'text-[#8E9BAE] hover:text-[var(--color-text)]'}`}
            >
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-6 p-3 bg-[#FF6F59]/10 border border-[var(--color-warning)]/30 rounded-[var(--radius-control)] text-[var(--color-warning)] text-xs font-mono flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <InputField 
                label="FULL NAME" 
                name="name"
                icon={User}
                placeholder="Sarvagya Singh" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            )}
            <InputField 
              label="EMAIL ADDRESS" 
              name="email"
              type="email"
              icon={FileText}
              placeholder="researcher@lab.edu" 
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputField 
              label="PASSWORD" 
              name="password"
              type="password"
              icon={ShieldAlert}
              placeholder="••••••••••••" 
              value={formData.password}
              onChange={handleChange}
              required
            />
            {!isLogin && (
               <InputField 
                label="CONFIRM PASSWORD" 
                name="confirmPassword"
                type="password"
                icon={ShieldAlert}
                placeholder="••••••••••••" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            )}
            
            <AcidButton loading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </AcidButton>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// --- SURVEY STEPS ---

const Step1Basic = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
    <div className="grid grid-cols-2 gap-4">
      <InputField label="AGE" type="number" value={data.age} onChange={e => update('age', e.target.value)} placeholder="YEARS" />
      <SelectField 
        label="GENDER" 
        value={data.gender} 
        onChange={e => update('gender', e.target.value)}
        options={[
          {value: 'male', label: 'MALE'},
          {value: 'female', label: 'FEMALE'},
          {value: 'other', label: 'OTHER'}
        ]}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <InputField label="HEIGHT (CM)" type="number" value={data.height} onChange={e => update('height', e.target.value)} placeholder="175" />
      <InputField label="WEIGHT (KG)" type="number" value={data.weight} onChange={e => update('weight', e.target.value)} placeholder="70" />
    </div>
    <SelectField 
        label="WEIGHT GOAL" 
        icon={Target}
        value={data.weightGoal} 
        onChange={e => update('weightGoal', e.target.value)}
        options={[
          {value: 'lose', label: 'LOSE WEIGHT'},
          {value: 'maintain', label: 'MAINTAIN WEIGHT'},
          {value: 'gain', label: 'GAIN WEIGHT'}
        ]}
      />
  </div>
);

const Step2Activity = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
    <SelectField 
      label="ACTIVITY LEVEL" 
      icon={Activity}
      value={data.activityLevel} 
      onChange={e => update('activityLevel', e.target.value)}
      options={[
        {value: 'sedentary', label: 'SEDENTARY'},
        {value: 'light', label: 'LIGHT (1-3 days)'},
        {value: 'moderate', label: 'MODERATE (3-5 days)'},
        {value: 'active', label: 'ACTIVE (6-7 days)'},
        {value: 'athlete', label: 'ATHLETE (2x/day)'},
      ]}
    />
    <SelectField 
      label="SLEEP DURATION" 
      icon={Moon}
      value={data.sleepDuration} 
      onChange={e => update('sleepDuration', e.target.value)}
      options={[
        {value: '<5', label: '< 5 HOURS'},
        {value: '5-6', label: '5-6 HOURS'},
        {value: '7-8', label: '7-8 HOURS (OPTIMAL)'},
        {value: '>8', label: '> 8 HOURS'},
      ]}
    />
     <SelectField 
      label="OCCUPATION TYPE" 
      icon={User}
      value={data.occupation} 
      onChange={e => update('occupation', e.target.value)}
      options={[
        {value: 'desk', label: 'DESK JOB'},
        {value: 'standing', label: 'STANDING/WALKING'},
        {value: 'physical', label: 'HEAVY PHYSICAL LABOR'},
      ]}
    />
  </div>
);

const Step3Medical = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
     <div className="space-y-3">
       <label className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase flex items-center gap-2">
          <span className="w-1 h-1 bg-[#FF3300]" /> DETECTED CONDITIONS
       </label>
       <div className="grid grid-cols-2 gap-3">
         {['Diabetes (T2DM)', 'Hypertension', 'Heart Disease', 'Thyroid', 'PCOS', 'None'].map(cond => (
           <label key={cond} className={`
              flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${data.conditions.includes(cond) 
                ? 'bg-[#FF3300]/10 border-[#FF3300] text-[#FF3300]' 
                : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-border)]'}
           `}>
             <input 
               type="checkbox" 
               className="hidden"
               checked={data.conditions.includes(cond)}
               onChange={(e) => {
                 if(e.target.checked) update('conditions', [...data.conditions, cond]);
                 else update('conditions', data.conditions.filter(c => c !== cond));
               }}
             />
             <span className="text-xs font-mono uppercase">{cond}</span>
           </label>
         ))}
       </div>
     </div>
     <div className="space-y-2">
       <label className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase flex items-center gap-2">
         <AlertCircle className="w-3 h-3 text-[#FF3300]" /> ALLERGIES
       </label>
       <textarea 
         className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[#FF3300] transition-colors resize-none h-20"
         placeholder="NUTS, DAIRY, SHELLFISH..."
         value={data.allergies}
         onChange={e => update('allergies', e.target.value)}
       />
     </div>
  </div>
);

const Step4Dietary = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
     <SelectField 
      label="DIETARY PATTERN" 
      icon={Utensils}
      value={data.dietPattern} 
      onChange={e => update('dietPattern', e.target.value)}
      options={[
        {value: 'omnivore', label: 'OMNIVORE'},
        {value: 'vegetarian', label: 'VEGETARIAN'},
        {value: 'vegan', label: 'VEGAN'},
        {value: 'keto', label: 'KETOGENIC'},
        {value: 'paleo', label: 'PALEO'},
        {value: 'mediterranean', label: 'MEDITERRANEAN'},
      ]}
    />
     <SelectField 
      label="MEAL FREQUENCY" 
      icon={Scale}
      value={data.mealsPerDay} 
      onChange={e => update('mealsPerDay', e.target.value)}
      options={[
        {value: '2', label: '2 MEALS (IF)'},
        {value: '3', label: '3 MEALS (Standard)'},
        {value: '4-5', label: '4-5 MEALS'},
        {value: '6', label: '6+ MEALS'},
      ]}
    />
    <div className="space-y-2">
       <label className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase flex items-center gap-2">
         <Info className="w-3 h-3 text-[var(--color-accent)]" /> FOOD DISLIKES
       </label>
       <textarea 
         className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none h-20"
         placeholder="MUSHROOMS, CILANTRO..."
         value={data.dislikes}
         onChange={e => update('dislikes', e.target.value)}
       />
     </div>
  </div>
);

const Step5Habits = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
    <div className="grid grid-cols-2 gap-4">
      <SelectField 
        label="WATER INTAKE" 
        icon={Droplets}
        value={data.waterIntake} 
        onChange={e => update('waterIntake', e.target.value)}
        options={[
          {value: '<1', label: '< 1 LITER'},
          {value: '1-2', label: '1-2 LITERS'},
          {value: '2-3', label: '2-3 LITERS'},
          {value: '3+', label: '3+ LITERS'},
        ]}
      />
      <SelectField 
        label="CAFFEINE" 
        icon={Coffee}
        value={data.caffeine} 
        onChange={e => update('caffeine', e.target.value)}
        options={[
          {value: 'none', label: 'NONE'},
          {value: '1-2', label: '1-2 CUPS'},
          {value: '3-4', label: '3-4 CUPS'},
          {value: '5+', label: '5+ CUPS'},
        ]}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <SelectField 
        label="ALCOHOL" 
        icon={Wine}
        value={data.alcohol} 
        onChange={e => update('alcohol', e.target.value)}
        options={[
          {value: 'none', label: 'NONE'},
          {value: 'occasional', label: 'OCCASIONAL'},
          {value: 'moderate', label: 'MODERATE'},
          {value: 'frequent', label: 'FREQUENT'},
        ]}
      />
       <SelectField 
        label="COOKING" 
        icon={Utensils}
        value={data.cooking} 
        onChange={e => update('cooking', e.target.value)}
        options={[
          {value: 'daily', label: 'DAILY'},
          {value: 'often', label: 'OFTEN'},
          {value: 'rarely', label: 'RARELY'},
        ]}
      />
    </div>
  </div>
);

const Step6Additional = ({ data, update }) => (
  <div className="space-y-6 animate-in slide-in-from-right duration-500">
    <div className="space-y-2">
       <label className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase flex items-center gap-2">
         <Pill className="w-3 h-3 text-[var(--color-accent)]" /> CURRENT MEDICATIONS LIST
       </label>
       <textarea 
         className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none h-24"
         placeholder="LISINOPRIL 10MG, METFORMIN 500MG..."
         value={data.medications}
         onChange={e => update('medications', e.target.value)}
       />
     </div>
     <SelectField 
        label="STRESS LEVEL" 
        icon={Zap}
        value={data.stress} 
        onChange={e => update('stress', e.target.value)}
        options={[
          {value: 'low', label: 'LOW'},
          {value: 'moderate', label: 'MODERATE'},
          {value: 'high', label: 'HIGH'},
          {value: 'severe', label: 'SEVERE'},
        ]}
      />
      <div className="space-y-2">
       <label className="text-[10px] font-mono tracking-widest text-[var(--color-text-muted)] uppercase flex items-center gap-2">
         <Target className="w-3 h-3 text-[var(--color-accent)]" /> SPECIFIC HEALTH GOALS
       </label>
       <textarea 
         className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-4 py-3 rounded-lg font-mono text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none h-24"
         placeholder="REDUCE A1C, LOWER BLOOD PRESSURE..."
         value={data.healthGoals}
         onChange={e => update('healthGoals', e.target.value)}
       />
     </div>
  </div>
);

// --- MEDICAL SURVEY WRAPPER ---

const MedicalSurvey = ({ user, onLogout, onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State init
  const [surveyData, setSurveyData] = useState({
    age: '', gender: '', height: '', weight: '', weightGoal: '', // Step 1
    activityLevel: '', sleepDuration: '', occupation: '', // Step 2
    conditions: [], allergies: '', // Step 3
    dietPattern: '', mealsPerDay: '', dislikes: '', // Step 4
    waterIntake: '', caffeine: '', alcohol: '', cooking: '', // Step 5
    medications: '', stress: '', healthGoals: '' // Step 6
  });

  const updateSurveyData = (field, value) => {
    setSurveyData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    // Basic validation logic
    if (step < totalSteps) setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // --- FIRESTORE SAVE LOGIC ---
      await updateDoc(doc(db, 'users', user.uid), {
        surveyData: surveyData,
        surveyCompleted: true,
        surveyCompletedAt: new Date().toISOString()
      });

      // Pass both data and user to complete
      onComplete({ ...surveyData, user });
    } catch (err) {
      console.error("Survey Save Error:", err);
      setError("FAILED TO UPLOAD CLINICAL DATA. RETRY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <div className="px-6 py-4 bg-[var(--color-surface)]/90 backdrop-blur border-b border-[var(--color-border)] flex justify-between items-center sticky top-0 z-50">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center font-bold text-[var(--color-accent)] border border-[var(--color-accent)]/30">
               {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--color-text)]">{user.name || 'USER'}</h2>
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase">{user.email}</p>
            </div>
         </div>
         <button onClick={onLogout} className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-center gap-2">
            <LogOut className="w-3 h-3" /> TERMINATE_SESSION
         </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
           {/* Progress Bar */}
           <div className="mb-12">
              <div className="flex justify-between items-end mb-2">
                 <h1 className="text-3xl font-bold text-[var(--color-text)] tracking-tight">CLINICAL INTAKE</h1>
                 <span className="font-mono text-[var(--color-accent)] text-xl">0{step}/0{totalSteps}</span>
              </div>
              <div className="h-1 bg-[var(--color-surface)] w-full rounded-full overflow-hidden">
                 <motion.div 
                   className="h-full bg-[var(--color-accent)]"
                   initial={{ width: 0 }}
                   animate={{ width: `${(step/totalSteps) * 100}%` }}
                 />
              </div>
           </div>

           {/* Dynamic Step Content */}
           <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 relative overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                 <Database className="w-32 h-32 text-[var(--color-text-muted)]" />
              </div>
              
              <div className="flex-1">
                {error && (
                   <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs font-mono flex items-center gap-2">
                     <AlertCircle className="w-4 h-4" /> {error}
                   </div>
                )}
                <AnimatePresence mode="wait">
                  {step === 1 && <Step1Basic key="1" data={surveyData} update={updateSurveyData} />}
                  {step === 2 && <Step2Activity key="2" data={surveyData} update={updateSurveyData} />}
                  {step === 3 && <Step3Medical key="3" data={surveyData} update={updateSurveyData} />}
                  {step === 4 && <Step4Dietary key="4" data={surveyData} update={updateSurveyData} />}
                  {step === 5 && <Step5Habits key="5" data={surveyData} update={updateSurveyData} />}
                  {step === 6 && <Step6Additional key="6" data={surveyData} update={updateSurveyData} />}
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex gap-4 mt-12 pt-8 border-t border-[var(--color-border)]">
                 <AcidButton 
                   variant="secondary" 
                   disabled={step === 1 || loading}
                   onClick={() => setStep(s => s - 1)}
                   className="flex-1"
                 >
                   <ArrowLeft className="w-4 h-4" /> PREVIOUS
                 </AcidButton>
                 
                 {step < totalSteps ? (
                   <AcidButton onClick={handleNext} className="flex-1">
                     NEXT PHASE <ArrowRight className="w-4 h-4" />
                   </AcidButton>
                 ) : (
                   <AcidButton onClick={handleSubmit} loading={loading} className="flex-1">
                     COMPILE DATASET <CheckCircle2 className="w-4 h-4" />
                   </AcidButton>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// --- LOADING SCREEN ---

const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center relative z-50">
    <div className="text-center">
       <div className="w-24 h-24 mx-auto mb-8 relative">
          <motion.div 
            className="absolute inset-0 border-t-2 border-[var(--color-accent)] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.div 
            className="absolute inset-2 border-t-2 border-[var(--color-accent)] rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
          <Stethoscope className="absolute inset-0 m-auto w-8 h-8 text-[var(--color-text)] opacity-50" />
       </div>
       <h2 className="text-[var(--color-text)] font-mono text-sm tracking-widest animate-pulse">INITIALIZING SYSTEM...</h2>
    </div>
  </div>
);

// --- MAIN APP COMPONENT (INTEGRATED) ---

export default function ClinicalCDSS() {
  const [appState, setAppState] = useState('loading'); // loading, auth, survey, dashboard
  const [currentUser, setCurrentUser] = useState(null);
  const router = useRouter();

  // --- RESTORE SESSION LOGIC ---
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const savedUid = getUserFromCookies();
        if (!savedUid) {
          setAppState('auth');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', savedUid));
        if (!userDoc.exists()) {
          clearUserCookies();
          setAppState('auth');
          return;
        }

        const userData = userDoc.data();
        const userInfo = {
          uid: savedUid,
          name: userData.name,
          email: userData.email,
          surveyCompleted: userData.surveyCompleted
        };

        setCurrentUser(userInfo);
        setAppState(userData.surveyCompleted ? 'dashboard' : 'survey');
      } catch (error) {
        console.error("Session Restoration Error:", error);
        setAppState('auth');
      }
    };

    checkAuthState();
  }, []);

  const handleAuthComplete = (user) => {
    setCurrentUser(user);
    setAppState(user.surveyCompleted ? 'dashboard' : 'survey');
  };

  const handleSurveyComplete = (data) => {
    setAppState('dashboard');
    router.push('/chat'); // Redirect if you have a chat route
  };

  const handleLogout = () => {
    clearUserCookies();
    setCurrentUser(null);
    setAppState('auth');
  };

  return (
    <div className="bg-[var(--color-bg)] min-h-screen text-[var(--color-text)] font-sans selection:bg-[var(--color-accent)] selection:text-black">
      <AnimatePresence mode="wait">
        {appState === 'loading' && (
          <motion.div key="loading" exit={{ opacity: 0 }}>
             <LoadingScreen />
          </motion.div>
        )}

        {appState === 'auth' && (
          <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AuthenticationFlow onAuthComplete={handleAuthComplete} />
          </motion.div>
        )}

        {appState === 'survey' && currentUser && (
          <motion.div key="survey" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <MedicalSurvey 
               user={currentUser} 
               onLogout={handleLogout} 
               onComplete={handleSurveyComplete} 
             />
          </motion.div>
        )}

        {appState === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
             <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-12 rounded-[var(--radius-card)] max-w-lg shadow-[var(--shadow-card)] relative overflow-hidden">
                   <div className="w-20 h-20 bg-[var(--color-accent)]/10 rounded-[var(--radius-control)] flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-[var(--color-accent)]" />
                   </div>
                   <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4 text-left">Profile Compiled</h2>
                   <p className="text-[#8E9BAE] mb-8 leading-relaxed text-left">
                     Your clinical baseline is set. PromptBiotics now checks drug-nutrient interactions
                     in real time for T2DM, hypertension, and CKD patients.
                   </p>
                   <div className="space-y-3">
                      <button onClick={() => router.push('/chat')} className="w-full bg-[var(--color-accent)] text-black px-8 py-3 font-bold font-mono text-xs uppercase rounded-[var(--radius-control)] hover:opacity-90 transition-opacity text-left">
                        Launch Console
                      </button>
                      <button onClick={handleLogout} className="w-full border border-[var(--color-border)] text-[#8E9BAE] px-8 py-3 font-mono text-xs uppercase rounded-[var(--radius-control)] hover:bg-[var(--color-surface)] transition-colors text-left">
                        Close Session
                      </button>
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
