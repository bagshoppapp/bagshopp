import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Cuando se despliega en App Hosting, initializeApp() automáticamente
// encuentra las credenciales de servicio. No se necesita configuración manual.
if (!getApps().length) {
  initializeApp();
}

const adminDB = getFirestore();
const adminAuth = getAuth();

export { adminDB, adminAuth };
