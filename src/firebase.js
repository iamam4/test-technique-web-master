

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
    apiKey: "AIzaSyAIId2ByN9c0RX9_R71EbJJoV-lB1RDADc",
    authDomain: "test-technique-beeldi.firebaseapp.com",
    databaseURL: "https://test-technique-beeldi.firebaseio.com",
    projectId: "test-technique-beeldi",
    storageBucket: "test-technique-beeldi.appspot.com",
    messagingSenderId: "937748581892",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);
const functions = getFunctions(app);

export {
    app,
    auth,
    database,
    storage,
    functions,
};
