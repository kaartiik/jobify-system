import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
let that;
class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    const f2 = app.initializeApp(firebaseConfig, 'another');

    this.auth = app.auth();
    this.auth2 = f2.auth();
    this.db = app.database();
    this.strg = app.storage();
    that = this;
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSecondaryCreateUserWithEmailAndPassword = (email, password) =>
    this.auth2.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doSignOut2 = () => this.auth2.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  verifyReset = (code) => this.auth.verifyPasswordResetCode(code);

  confirmReset = (code, newPw) => this.auth.confirmPasswordReset(code, newPw);

  updateKey = (email, encrypt) =>
    this.db
      .ref('Users')
      .orderByChild('email')
      .equalTo(email)
      .on('value', function (snapshot) {
        snapshot.forEach((child) =>
          that.db.ref('Users').child(child.key).child('key').set(encrypt)
        );
      });

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then((snapshot) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      } else {
        fallback();
      }
    });

  // *** User API ***

  user = (uid) => this.db.ref(`Users/${uid}`);

  users = () => this.db.ref('Users');

  avatar = () => this.strg.ref('Users');

  // *** Statements APi ***

  statementsStrg = () => this.strg.ref('Statements');

  database = () => this.db;

  // *** Visitors API ***

  getVisitors = () => this.db.ref('Visitors');

  imageFile = () => this.strg.ref('Visitors');

  storage = () => this.strg;
}

export default Firebase;
