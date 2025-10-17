# 📱 OTP Authentication - Complete Guide

## **How OTP Works with Supabase**

---

## 📧 **EMAIL OTP (Built-in, Works Out of the Box)**

### **How It Works:**

1. User enters email → clicks "Send OTP"
2. Supabase sends email with 6-digit code
3. User enters code → gets authenticated
4. Session created with JWT token

### **✅ What's Already Working:**

**In Local Development:**
- Supabase sends OTP emails automatically
- Check emails at: **http://127.0.0.1:54324** (Mailpit - local email viewer)
- No configuration needed!

**In Production:**
- Supabase uses their SMTP by default (FREE!)
- **100 emails/hour** included
- No setup required

### **Code Example:**

```typescript
// Send OTP to email
const { data, error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
});

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email',
});
```

---

## 📱 **PHONE OTP (Needs Twilio Setup)**

### **How It Works:**

1. User enters phone → clicks "Send OTP"
2. Supabase → Twilio → SMS to user
3. User enters code → gets authenticated
4. Session created

### **⚠️ Requires Setup:**

You need a **Twilio account** (free trial available):

#### **Step 1: Create Twilio Account** (5 min)

1. Go to: https://www.twilio.com/try-twilio
2. Sign up (free trial: $15 credit!)
3. Verify your own phone number
4. Get credentials:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

#### **Step 2: Buy Phone Number** (2 min)

1. In Twilio dashboard → **Phone Numbers** → **Buy a Number**
2. Choose a number (~$1/month)
3. Copy the number: `+1XXXXXXXXXX`

#### **Step 3: Configure Supabase** (3 min)

**For Local Testing:**
```bash
# Not supported in local Supabase
# Need to use Supabase Cloud for phone OTP
```

**For Production (Supabase Cloud):**
1. Go to: Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Phone** provider
3. Choose **Twilio**
4. Enter:
   - Twilio Account SID
   - Twilio Auth Token
   - Twilio Phone Number
5. Save

#### **Step 4: Test Phone OTP**

```typescript
// Send OTP to phone
const { data, error } = await supabase.auth.signInWithOtp({
  phone: '+11234567890',
});

// Verify OTP
const { data, error } = await supabase.auth.verifyOtp({
  phone: '+11234567890',
  token: '123456',
  type: 'sms',
});
```

---

## 💰 **Costs**

### **Email OTP:**
- **Supabase Free**: 100 emails/hour (FREE!)
- **Supabase Pro**: Unlimited ($25/month includes everything)
- **Custom SMTP**: Can use Resend/SendGrid for more volume

### **Phone OTP (Twilio):**
- **Free Trial**: $15 credit (~200 SMS)
- **Production**: $0.0075 per SMS
- **Phone Number**: ~$1/month
- **Example**: 1,000 users signup = $7.50 + $1 = **$8.50**

---

## 🎯 **Recommended Approach**

### **For Local Testing (Now):**
Use **Email OTP only**
- ✅ Works immediately
- ✅ Check emails at: http://127.0.0.1:54324
- ✅ Zero setup
- ✅ Zero cost

### **For Production Launch:**

**Option 1: Email Only** (Easiest)
- ✅ Works out of the box
- ✅ Free with Supabase
- ✅ Most users have email

**Option 2: Email + Phone** (Best UX)
- ✅ Add Twilio (~$50/month for 1K signups)
- ✅ Better conversion rate
- ✅ Professional

---

## 📝 **Current Implementation**

### **What I've Built:**

Your `auth.ts` already supports both:

```typescript
// Email OTP (works now!)
export const signInWithEmail = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({ email });
  return { data, error };
};

// Phone OTP (needs Twilio)
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({ phone });
  return { data, error };
};

// Verify either
export const verifyOTP = async (contact: string, token: string, type: 'email' | 'sms') => {
  const { data, error } = await supabase.auth.verifyOtp({
    [type === 'sms' ? 'phone' : 'email']: contact,
    token,
    type,
  });
  return { data, error };
};
```

---

## 🧪 **Testing Email OTP (Local)**

### **Step 1: Start Supabase**
```bash
cd /Users/lohithsurisetti/onlyOne.today/supabase
supabase start
```

### **Step 2: Open Mailpit**
Open in browser: **http://127.0.0.1:54324**

This is a local email viewer - all OTP emails go here!

### **Step 3: Test in App**

1. Start mobile app
2. Enter email on signup
3. Click "Send OTP"
4. Go to Mailpit (http://127.0.0.1:54324)
5. Copy the 6-digit code
6. Enter in app
7. ✅ Authenticated!

---

## 🔄 **What We're Currently Using**

### **Current Flow (UsernamePasswordScreen):**

**We're using Email + Password** (simpler for now):
- User enters: email, username, password
- We call: `supabase.auth.signUp({ email, password })`
- User is immediately logged in
- No OTP needed!

**This is actually BETTER** because:
- ✅ Faster signup (no OTP step)
- ✅ Works locally
- ✅ No Twilio needed
- ✅ User can reset password

---

## 🎯 **Recommendation**

### **For MVP/Testing (Now):**
**Keep current approach**: Email + Password
- ✅ Already implemented
- ✅ Works locally
- ✅ Zero setup
- ✅ No costs

### **For Production (Later):**

**Option A**: Keep Email + Password (Easiest)
- ✅ No changes needed
- ✅ Add "Forgot Password" flow
- ✅ Most apps use this

**Option B**: Add Phone OTP (Better UX)
- Set up Twilio ($8-50/month)
- Add OTPVerificationScreen
- Better for mobile-first apps

**Option C**: Email OTP (Middle ground)
- Remove password requirement
- Use OTP for login
- Still free, slightly better UX

---

## 🔧 **If You Want to Add Email OTP**

I can update the signup flow to use OTP instead of password:

### **New Flow:**
1. User enters: name, email, username
2. Click "Send OTP" → Email sent
3. Enter 6-digit code
4. ✅ Account created + logged in

**Pros:**
- Passwordless (modern UX)
- Still free
- Works locally

**Cons:**
- Extra step
- Relies on email delivery

---

## ❓ **What Do You Prefer?**

**A)** Keep current Email + Password (simpler, works now)

**B)** Switch to Email OTP (passwordless, one extra step)

**C)** Add Phone OTP (needs Twilio ~$50/mo, best UX)

**D)** Offer both Email + Phone OTP (maximum flexibility)

---

**For testing, I recommend keeping Email + Password (Option A)**

**For production, we can add Phone OTP later when you have revenue!**

Let me know what you prefer and I'll implement it! 🚀

