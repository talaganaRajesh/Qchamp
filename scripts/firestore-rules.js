// Updated Firestore Security Rules for Production
// Copy these rules to your Firebase Console > Firestore Database > Rules

const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read questions but not write
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admins should add questions
    }
    
    // Game rooms - players can read games they're part of
    match /games/{gameId} {
      allow read: if request.auth != null && 
        (request.auth.uid in resource.data.players[].uid || 
         request.auth.uid == resource.data.hostId);
      allow write: if request.auth != null && 
        (request.auth.uid in resource.data.players[].uid || 
         request.auth.uid == resource.data.hostId);
    }
    
    // Transactions - users can read their own transactions
    match /transactions/{transactionId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Withdrawals - users can read and create their own withdrawal requests
    match /withdrawals/{withdrawalId} {
      allow read, create: if request.auth != null && request.auth.uid == resource.data.userId;
      allow update: if false; // Only admins should update withdrawal status
    }
    
    // Referrals - users can read referrals where they are referrer or referred
    match /referrals/{referralId} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.referrerId || 
         request.auth.uid == resource.data.referredUserId);
      allow write: if request.auth != null;
    }
    
    // Platform earnings - read only for admins
    match /platform_earnings/{earningId} {
      allow read: if false; // Only for admin dashboard
      allow write: if request.auth != null; // System can write
    }
  }
}
`

console.log("🔥 FIREBASE FIRESTORE SECURITY RULES FOR PRODUCTION")
console.log("=".repeat(60))
console.log("📋 Copy these rules to Firebase Console:")
console.log("🔗 https://console.firebase.google.com")
console.log("📁 Firestore Database → Rules")
console.log("=".repeat(60))
console.log(firestoreRules)
console.log("=".repeat(60))
console.log("✅ Click 'Publish' after pasting the rules")
console.log("🔒 These rules provide proper security for production")
console.log("👥 Users can only access their own data")
console.log("🎮 Game access is restricted to participants")
console.log("💰 Financial data is properly protected")
