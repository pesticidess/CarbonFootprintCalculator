// Toggle visibility of the estimation section and disable/enable inputs accordingly
function toggleEstimation() {
  const estimationSection = document.getElementById('estimation');
  const electricityInput = document.getElementById('electricityUsage');
  const calculateButton = document.querySelector('#electricity button');

  if (estimationSection.style.display === "none") {
      estimationSection.style.display = "block";
      electricityInput.disabled = true; // Disable original input
      calculateButton.disabled = true; // Disable calculate button
  } else {
      estimationSection.style.display = "none";
      electricityInput.disabled = false; // Enable original input
      calculateButton.disabled = false; // Enable calculate button
  }
}

const emissionFactors = {
  electricity: 0.5, // kg CO2 per kWh
  biomass: 0.02, // kg CO2 per kg biomass
  lpg: 3.0 // kg CO2 per kg LPG
};

function calculateElectricity() {
  const usage = document.getElementById('electricityUsage').value;
  const emissions = usage * emissionFactors.electricity;
  document.getElementById('electricityResult').innerText = `CO2 Emissions from Electricity: ${emissions.toFixed(2)} kg`;
  updateTotal();
}

function calculateBiomass() {
  const organicWaste = parseFloat(document.getElementById('organicWaste').value) || 0;
  const organicWasteUnit = document.getElementById('organicWasteUnit').value;

  const yardWaste = parseFloat(document.getElementById('yardWaste').value) || 0;
  const yardWasteUnit = document.getElementById('yardWasteUnit').value;

  const paperWaste = parseFloat(document.getElementById('paperWaste').value) || 0;
  const paperWasteUnit = document.getElementById('paperWasteUnit').value;

  const organicWasteKg = organicWasteUnit === 'kg' ? organicWaste : organicWaste / 1000;
  const yardWasteKg = yardWasteUnit === 'kg' ? yardWaste : yardWaste / 1000;
  const paperWasteKg = paperWasteUnit === 'kg' ? paperWaste : paperWaste / 1000;

  const organicWasteFactor = 0.01; // Example: 1% emissions for organic waste
  const yardWasteFactor = 0.01; // Example: 1% emissions for yard waste
  const paperWasteFactor = 0.02; // Example: 2% emissions for paper waste

  const organicEmissions = organicWasteKg * organicWasteFactor;
  const yardEmissions = yardWasteKg * yardWasteFactor;
  const paperEmissions = paperWasteKg * paperWasteFactor;

  const totalBiomassEmissions = (organicEmissions + yardEmissions + paperEmissions)*30;

  document.getElementById('biomassResult').innerText = `CO2 Emissions from Biomass: ${totalBiomassEmissions.toFixed(2)} kg`;
  updateTotal();
}



function calculateLPG() {
  const cookingTime = parseFloat(document.getElementById('cookingTime').value) || 0;
  const cookingTimeUnit = document.getElementById('cookingTimeUnit').value;

  const showerTime = parseFloat(document.getElementById('showerTime').value) || 0;
  const showerTimeUnit = document.getElementById('showerTimeUnit').value;

  // Convert all times to hours for calculation
  const cookingTimeHours = cookingTimeUnit === 'hr' ? cookingTime : cookingTime / 60;
  const showerTimeHours = showerTimeUnit === 'hr' ? showerTime : showerTime / 60;

  // Emission factors for LPG (example values in kg CO2 per hour)
  const cookingEmissionsFactor = 0.05; // Example: 0.05 kg CO2 per hour for cooking
  const showerEmissionsFactor = 0.07; // Example: 0.07 kg CO2 per hour for showering

  const cookingEmissions = cookingTimeHours * cookingEmissionsFactor;
  const showerEmissions = showerTimeHours * showerEmissionsFactor;

  const totalLPGEmissions = (cookingEmissions + showerEmissions)*30;

  document.getElementById('lpgResult').innerText = `CO2 Emissions from LPG: ${totalLPGEmissions.toFixed(2)} kg`;
  updateTotal();
}


function estimateElectricity() {
  const lightHours = parseFloat(document.getElementById('lightHours').value);
  const acHours = parseFloat(document.getElementById('acHours').value);
  const otherHours = parseFloat(document.getElementById('otherHours').value);

  // Average wattage for appliances (in watts)
  const lightWattage = 10; // Example: 10W per light bulb
  const acWattage = 2000; // Example: 2000W for an air conditioner
  const otherWattage = 500; // Example: 500W for other appliances

  // Calculate estimated monthly usage (kWh)
  const estimatedMonthlyUsage = (
      (lightHours * lightWattage + acHours * acWattage + otherHours * otherWattage) * 30 / 1000
  );

  document.getElementById('estimatedUsageResult').innerText =
      `Estimated Monthly Electricity Usage: ${estimatedMonthlyUsage.toFixed(2)} kWh`;

  // Set the estimated value in the electricity usage field
  document.getElementById('electricityUsage').value = estimatedMonthlyUsage.toFixed(2);
  updateTotal(); // Update total emissions
}

function updateTotal() {
  const electricityEmissions = document.getElementById('electricityResult').innerText ?
      parseFloat(document.getElementById('electricityResult').innerText.split(': ')[1]) :
      0;
  const biomassEmissions = document.getElementById('biomassResult').innerText ?
      parseFloat(document.getElementById('biomassResult').innerText.split(': ')[1]) :
      0;
  const lpgEmissions = document.getElementById('lpgResult').innerText ?
      parseFloat(document.getElementById('lpgResult').innerText.split(': ')[1]) :
      0;

  const totalEmissions = electricityEmissions + biomassEmissions + lpgEmissions;
  document.getElementById('totalResult').innerText = `Total CO2 Emissions: ${totalEmissions.toFixed(2)} kg`;
  calculateAbsorptionTime(totalEmissions)
}

function calculateCarEmissions(carNumber) {
  const distance = parseFloat(document.getElementById(`car${carNumber}Distance`).value) || 0;
  const carType = document.getElementById(`car${carNumber}Type`).value;
  let emissionsFactor;

  // Define emission factors based on car type
  switch (carType) {
      case 'hybrid':
          emissionsFactor = 0.05; // Example: 0.05 kg CO2 per km for hybrid
          break;
      case 'petrol':
          emissionsFactor = 0.2; // Example: 0.2 kg CO2 per km for petrol
          break;
      case 'diesel':
          emissionsFactor = 0.15; // Example: 0.15 kg CO2 per km for diesel
          break;
      case 'electric':
          emissionsFactor = 0.02; // Example: 0.02 kg CO2 per km for electric
          break;
      default:
          emissionsFactor = 0; // Default to 0 if no type is selected
          break;
  }

  const totalEmissions = distance * emissionsFactor;
  document.getElementById(`car${carNumber}Result`).innerText = `CO2 Emissions from Car ${carNumber}: ${totalEmissions.toFixed(2)} kg`;
  calculateTotalEmissions()
}

function calculateMotorcycleEmissions() {
  const distance = parseFloat(document.getElementById('motorcycleDistance').value) || 0;
  const motorcycleSize = document.getElementById('motorcycleSize').value;
  let emissionsFactor;

  switch (motorcycleSize) {
      case 'small':
          emissionsFactor = 0.05; // Example: 0.05 kg CO2 per km for small motorcycles
          break;
      case 'medium':
          emissionsFactor = 0.1; // Example: 0.1 kg CO2 per km for medium motorcycles
          break;
      case 'large':
          emissionsFactor = 0.15; // Example: 0.15 kg CO2 per km for large motorcycles
          break;
      default:
          emissionsFactor = 0; // Default to 0 if no size is selected
          break;
  }

  const totalEmissions = distance * emissionsFactor;
  document.getElementById('motorcycleResult').innerText = `CO2 Emissions from Motorcycle: ${totalEmissions.toFixed(2)} kg`;
  calculateTotalEmissions()
}

function calculateTotalEmissions() {

  const motorcycleEmissions = document.getElementById('motorcycleResult').innerText ?
      parseFloat(document.getElementById('motorcycleResult').innerText.split(': ')[1]) :
      0;
  const car1Emissions = document.getElementById('car1Result').innerText ?
      parseFloat(document.getElementById('car1Result').innerText.split(': ')[1]) :
      0;
  const car2Emissions = document.getElementById('car2Result').innerText ?
      parseFloat(document.getElementById('car2Result').innerText.split(': ')[1]) :
      0;
      const car3Emissions = document.getElementById('car3Result').innerText ?
      parseFloat(document.getElementById('car3Result').innerText.split(': ')[1]) :
      0;

  // Calculate the total result by adding all the individual results
  const totalResult = motorcycleEmissions + car1Emissions + car2Emissions + car3Emissions;

  // Display the total result
  document.getElementById("totalResult").textContent = `Total Carbon Footprint: ${totalResult.toFixed(2)} kg CO2`;
  calculateAbsorptionTime(totalResult)
}


function toggleCarSection(sectionId, buttonId) {
  const section = document.getElementById(sectionId);
  const button = document.getElementById(buttonId);

  if (section.style.display === "none" || section.style.display === "") {
      section.style.display = "block"; // Show section
      button.style.display = "none"; // Hide the add button
  } else {
      section.style.display = "none"; // Hide section
      button.style.display = "inline-block"; // Show the add button again
  }
}

const dataCount = {
  rice: 0,
  meat: 0,
  vegetables: 0
};
const totalItems = () => dataCount.rice + dataCount.meat + dataCount.vegetables;
// Chart.js initialization
const ctx = document.getElementById('foodChart').getContext('2d');
const pieChart = new Chart(ctx, {
  type: 'pie',
  data: {
      labels: ['Rice', 'Meat', 'Vegetables'],
      datasets: [{
          label: 'Food Items',
          data: [0, 0, 0],
          backgroundColor: ['#16423C', '#6A9C89', '#C4DAD2']
      }]
  }
});

function updateChart() {
  const total = totalItems();
  document.querySelector('.placeholder').style.display = total === 0 ? 'block' : 'none';
  pieChart.data.datasets[0].data = [
      (dataCount.rice / total) * 100 || 0,
      (dataCount.meat / total) * 100 || 0,
      (dataCount.vegetables / total) * 100 || 0
  ];

  pieChart.update();

  const riceWeight = (dataCount.rice / total) * 300;
  const meatWeight = (dataCount.meat / total) * 300;
  const vegetablesWeight = (dataCount.vegetables / total) * 300;

  const totalEmissions = (riceWeight * 0.0006) +
      (meatWeight * 0.007) +
      (vegetablesWeight * 0.0002);

  document.getElementById('carbon-footprint').innerText = totalEmissions.toFixed(2);
  calculateAbsorptionTime(totalEmissions)
}

// Drag-and-drop events
document.querySelectorAll('.food-item').forEach(item => {
  item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('type', e.target.dataset.type);
  });
});

document.querySelector('.food-container').addEventListener('dragover', (e) => e.preventDefault());

document.querySelector('.food-container').addEventListener('drop', (e) => {
  e.preventDefault();
  const type = e.dataTransfer.getData('type');
  if (type) {
      dataCount[type]++;
      updateChart();
  }
});

function calculateAbsorptionTime(totalCO2) {
  const dailyAbsorptionPerTree = 0.06; // kg of CO₂ absorbed per day by one tree
  const daysToAbsorbCO2 = totalCO2 / dailyAbsorptionPerTree;

document.getElementById("absorption-time").textContent = ` (~${Math.ceil(daysToAbsorbCO2)} days for 1 tree to absorb)`;


}