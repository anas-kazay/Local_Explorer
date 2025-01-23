function getTemperatureCategory(temp) {
  if (temp < 10) return "Cold";
  if (temp < 20) return "Cool";
  if (temp < 30) return "Warm";
  return "Hot";
}

function getTimeOfDay(timestamp, timezone) {
  const date = new Date((timestamp + timezone) * 1000);
  const hours = date.getUTCHours();
  if (hours < 5) return "Night";
  if (hours < 12) return "Morning";
  if (hours < 17) return "Afternoon";
  return "Evening";
}

module.exports= {
    getTimeOfDay,
    getTemperatureCategory
}