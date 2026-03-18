// Lumia Stream Diagnostics
(function() {
    console.log("=== LUMIA SCRIPT DIAGNOSTICS START ===");
    
    // 1. Check if PIXI and Matter are loaded
    console.log("PIXI available:", typeof PIXI !== 'undefined');
    console.log("Matter available:", typeof Matter !== 'undefined');
    
    // 2. Check script character limit
    // We will generate a large string dynamically to see if it causes issues
    try {
        var size = 1024 * 1024 * 5; // 5MB
        var testStr = "a".repeat(size);
        console.log("Successfully generated " + (size / (1024 * 1024)) + "MB string in memory.");
    } catch(e) {
        console.error("Failed to generate large string:", e);
    }
    
    // 3. Document details
    console.log("Current script size limits or truncation might be happening if the code is too large.");
    console.log("=== LUMIA SCRIPT DIAGNOSTICS END ===");
    
    // Alert the user so they see it immediately
    alert("Diagnostics Complete. Check Lumia Console.");
})();
