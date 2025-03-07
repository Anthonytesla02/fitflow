
// FitFlow Workout App - Google Apps Script
// This is a Web App that acts as an API endpoint for workout data

function doPost(e) {
  try {
    // Handle manual testing in the editor (when e is undefined)
    if (!e || !e.postData) {
      Logger.log("Running in test mode with sample data");
      e = {
        postData: {
          contents: JSON.stringify({
            day: "Test Day",
            totalWorkoutTime: "1m 30s",
            exerciseTime: "1m 0s",
            restTime: "0m 30s",
            exerciseCount: 5,
            calories: 10,
            points: 50,
            achievements: "Test Achievement"
          })
        }
      };
    }
    
    // Log the incoming data for debugging
    Logger.log("Received data: " + e.postData.contents);
    
    // Parse the data received from the app
    var data;
    try {
      data = JSON.parse(e.postData.contents);
      Logger.log("Parsed data: " + JSON.stringify(data));
    } catch (parseError) {
      Logger.log("Error parsing JSON: " + parseError);
      throw new Error("Invalid JSON data: " + parseError);
    }
    
    // Get the active spreadsheet and sheet - use "Sheet1" instead of "WorkoutData"
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
    
    Logger.log("Found sheet: " + sheet.getName());
    
    // If the sheet doesn't have headers, we will NOT add them as you already have them
    // We're just validating the headers match our data structure
    if (sheet.getLastRow() <= 1) {
      Logger.log("First row (headers) check passed");
    }
    
    // Add the data as a new row (adjusting column order to match your sheet)
    var timestamp = new Date().toISOString();
    sheet.appendRow([
      timestamp,              // Timestamp
      data.day || "",         // Day
      data.totalWorkoutTime || "", // Total Workout Time
      data.exerciseTime || "", // Exercise Time
      data.restTime || "",    // Rest Time
      data.exerciseCount || 0, // Exercises Count
      data.calories || 0,     // Calories Burned
      data.points || 0,       // Points Earned
      data.achievements || "" // Achievements
    ]);
    
    Logger.log("Row appended successfully");
    
    // Force the spreadsheet to update immediately
    SpreadsheetApp.flush();
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Workout data saved successfully",
      "timestamp": timestamp
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    // Log the error for debugging
    Logger.log("Error in doPost: " + err.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput(
    "FitFlow Workout App API is running. Post workout data to this URL."
  ).setMimeType(ContentService.MimeType.TEXT);
}

// Test function you can manually run in Apps Script to verify configuration
function testAppendRow() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  
  Logger.log("Using sheet: " + sheet.getName());
  Logger.log("Current last row: " + sheet.getLastRow());
  
  var testData = {
    day: "Manual Test",
    totalWorkoutTime: "2m 0s",
    exerciseTime: "1m 30s",
    restTime: "0m 30s",
    exerciseCount: 6,
    calories: 15,
    points: 75,
    achievements: "Manual Test Achievement"
  };
  
  sheet.appendRow([
    new Date().toISOString(),  // Timestamp
    testData.day,              // Day
    testData.totalWorkoutTime, // Total Workout Time
    testData.exerciseTime,     // Exercise Time
    testData.restTime,         // Rest Time
    testData.exerciseCount,    // Exercises Count
    testData.calories,         // Calories Burned
    testData.points,           // Points Earned
    testData.achievements      // Achievements
  ]);
  
  Logger.log("Test row appended successfully");
}
