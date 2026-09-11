<x-app-layout>
    <x-slot name="header">
        <h1 class="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
    </x-slot>

    <div class="space-y-4">

        <!-- Sensor Trends -->
        <section class="p-3 bg-white rounded shadow-sm">
            <h2 class="mb-2 text-lg font-semibold text-gray-800">Sensor Trends</h2>
            <canvas id="sensorChart" class="w-full h-32"></canvas>
            <p class="mt-1 text-xs text-gray-500">Avg EC: 1.0 | Avg pH: 6.2 | Optimal: 85%</p>
        </section>

        <!-- Pump Usage -->
        <section class="p-3 bg-white rounded shadow-sm">
            <h2 class="mb-2 text-lg font-semibold text-gray-800">Pump Usage</h2>
            <canvas id="pumpChart" class="w-full h-32"></canvas>
            <p class="mt-1 text-xs text-gray-500">Total Activations: 14 (A:5, B:3, pH:4, Water:2)</p>
        </section>

        <!-- Automation Effectiveness -->
        <section class="p-3 bg-white rounded shadow-sm">
            <h2 class="mb-2 text-lg font-semibold text-gray-800">Automation Effectiveness</h2>
            <canvas id="automationChart" class="w-full h-32"></canvas>
            <p class="mt-1 text-xs text-gray-500">Balanced Actions: 80% | Out of Range: 20%</p>
        </section>

        <!-- Alerts Summary -->
        <section class="p-3 bg-white rounded shadow-sm">
            <h2 class="mb-2 text-lg font-semibold text-gray-800">Alerts Summary</h2>
            <canvas id="alertsChart" class="w-full h-32"></canvas>
            <p class="mt-1 text-xs text-gray-500">Alerts: High EC(3), Low EC(2), High pH(4), Low pH(1)</p>
        </section>

    </div>

    <!-- Chart.js CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <script>
        // Sensor Trends (EC & pH over time)
        new Chart(document.getElementById('sensorChart'), {
            type: 'line',
            data: {
                labels: ['Day 1','Day 2','Day 3','Day 4','Day 5'],
                datasets: [
                    { label: 'EC', data: [0.9,1.0,1.1,1.3,1.0], borderColor: 'blue', fill: false },
                    { label: 'pH', data: [7.2,6.8,6.5,6.0,6.2], borderColor: 'green', fill: false }
                ]
            }
        });

        // Pump Usage
        new Chart(document.getElementById('pumpChart'), {
            type: 'bar',
            data: {
                labels: ['A','B','pH Down','Water'],
                datasets: [{ data: [5,3,4,2], backgroundColor: ['#3b82f6','#6366f1','#10b981','#f59e0b'] }]
            }
        });

        // Automation Effectiveness
        new Chart(document.getElementById('automationChart'), {
            type: 'doughnut',
            data: {
                labels: ['Balanced','Out of Range'],
                datasets: [{ data: [80,20], backgroundColor: ['#22c55e','#ef4444'] }]
            }
        });

        // Alerts Summary
        new Chart(document.getElementById('alertsChart'), {
            type: 'pie',
            data: {
                labels: ['High EC','Low EC','High pH','Low pH'],
                datasets: [{ data: [3,2,4,1], backgroundColor: ['#f87171','#60a5fa','#fbbf24','#a78bfa'] }]
            }
        });
    </script>
</x-app-layout>
