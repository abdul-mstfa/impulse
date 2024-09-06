document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('impulse-form');
    const table = document.getElementById('impulse-table').getElementsByTagName('tbody')[0];
    const totalPriceElement = document.getElementById('total-price');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        addItem();
    });

    // Add event listeners for Enter key on input fields
    const inputFields = form.querySelectorAll('input');
    inputFields.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addItem();
            }
        });
    });

    function addItem() {
        const itemName = document.getElementById('item-name').value;
        const store = document.getElementById('store').value;
        const price = parseFloat(document.getElementById('price').value);
        const url = document.getElementById('url').value;
        const timer = parseInt(document.getElementById('timer').value);

        const row = table.insertRow();
        row.innerHTML = `
            <td class="px-4 py-3">${itemName}</td>
            <td class="px-4 py-3">${store}</td>
            <td class="px-4 py-3">$${price.toFixed(2)}</td>
            <td class="px-4 py-3"><a href="${url}" target="_blank" class="text-blue-500 hover:underline">Link</a></td>
            <td class="px-4 py-3">${timer} days</td>
            <td class="px-4 py-3">
                <button class="text-red-500 hover:text-red-700" onclick="removeItem(this)">Remove</button>
            </td>
        `;

        form.reset();
        updateTotalPrice();
    }

    function removeItem(button) {
        const row = button.closest('tr');
        row.remove();
        updateTotalPrice();
    }

    function updateTotalPrice() {
        const prices = Array.from(table.querySelectorAll('tr td:nth-child(3)'))
            .map(td => parseFloat(td.textContent.replace('$', '')));
        const total = prices.reduce((sum, price) => sum + price, 0);
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    }
});

function startTimer(cell, days) {
    const endTime = new Date().getTime() + days * 24 * 60 * 60 * 1000;
    
    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = endTime - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            cell.textContent = "Timer Expired!";
            cell.parentElement.classList.add('bg-soft-red');
            notifyUser(cell.parentElement.cells[0].textContent);
        } else {
            const daysLeft = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((distance % (1000 * 60)) / 1000);
            cell.textContent = `${daysLeft}d:${hoursLeft.toString().padStart(2, '0')}h:${minutesLeft.toString().padStart(2, '0')}m:${secondsLeft.toString().padStart(2, '0')}s`;
        }
    }, 1000); // Update every second
}

function notifyUser(itemName) {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Impulse Timer Expired", {
                    body: `The timer for "${itemName}" has expired. Do you still want to buy it?`
                });
            }
        });
    }
}

// Load saved items from localStorage
loadItems();