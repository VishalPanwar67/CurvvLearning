const App_Name = "Logger";

function logMessage(msg) {
  console.log(`[${App_Name}] ${msg}`);
}

module.exports = { App_Name, logMessage };
