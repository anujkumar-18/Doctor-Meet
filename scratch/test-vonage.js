const { Vonage } = require("@vonage/server-sdk");
const { Auth } = require("@vonage/auth");
const fs = require("fs");
const path = require("path");

async function test() {
  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;
  const privateKeyPath = process.env.VONAGE_PRIVATE_KEY;

  console.log("App ID:", appId);
  console.log("Private Key Path:", privateKeyPath);

  if (!appId || !privateKeyPath) {
    console.error("Missing env vars");
    return;
  }

  try {
    const fullPath = path.join(process.cwd(), privateKeyPath);
    console.log("Checking full path:", fullPath);
    
    if (fs.existsSync(fullPath)) {
      console.log("File exists");
      const privateKey = fs.readFileSync(fullPath, "utf8");
      console.log("File read successfully (length):", privateKey.length);

      const credentials = new Auth({
        applicationId: appId,
        privateKey: privateKey,
      });
      const vonage = new Vonage(credentials);
      
      console.log("Vonage client initialized, attempting to create a test session...");
      const session = await vonage.video.createSession({ mediaMode: "routed" });
      console.log("SUCCESS! Session ID:", session.sessionId);
    } else {
      console.error("File does NOT exist at path:", fullPath);
    }
  } catch (error) {
    console.error("FAILED:", error.message);
    if (error.response) {
        console.error("Response data:", error.response.data);
    }
  }
}

test();
