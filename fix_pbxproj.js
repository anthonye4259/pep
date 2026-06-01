import { CapacitorProject } from '@capacitor/project';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function run() {
  try {
    const project = new CapacitorProject({
      ios: { path: join(__dirname, 'ios') },
    });

    await project.load();
    await project.ios.addEntitlements("App", {
      'com.apple.developer.healthkit': true,
      'com.apple.developer.healthkit.access': [],
      'com.apple.developer.healthkit.background-delivery': true
    });
    
    await project.commit();
    console.log("Successfully configured iOS project capabilities programmatically.");
  } catch (e) {
    console.error("Error configuring project:", e);
  }
}
run();
