const spinner = document.getElementById("spinner");
const activityTitle = document.getElementById("activity-title")
const activityText = document.getElementById("activity-text")

let lock = false

// lockButton and unlockButton are used to prevent the user from clicking the button multiple times
function lockButton() {
    lock = true;
    spinner.classList.remove("d-none");
}

function unlockButton() {
    lock = false;
    spinner.classList.add("d-none");
}

document.getElementById("generateButton").addEventListener("click", getRandomActivities)

async function getRandomActivities() {
    // If the button is locked, return
    if (lock) 
        return;
    lockButton();
    try {
        activityTitle.innerHTML = "";
        activityText.innerHTML = "";

        // Get the values from the form
        let types = Array.from(document.querySelectorAll('input[name="activityType"]:checked')).map(e => e.value);
        let priceMin = document.getElementById("priceMin").value;
        let priceMax = document.getElementById("priceMax").value;
        let accessibilityMin = document.getElementById("accessibilityMin").value;
        let accessibilityMax = document.getElementById("accessibilityMax").value;

        let url = `https://www.boredapi.com/api/activity?minprice=${priceMin}&maxprice=${priceMax}&minaccessibility=${accessibilityMin}&maxaccessibility=${accessibilityMax}`;
        let activities = [];
        for (let i = 0; i < 10; i++) {
            let _url = url
            // If there are types, add a random type to the url
            if (types.length > 0) {
                _url += `&type=${types[Math.floor(Math.random() * types.length)]}`;
            }
            await fetch(_url).then(response => response.json()).then(data => {
                if (data.error)
                    return;
                // If the activity is already in the list, skip it
                if (activities.map(activity => activity.key).includes(data.key))
                    return;
                activities.push(data);
            })
        }
        if (activities.length == 0) {
            activityTitle.innerHTML = "No activity found";
            activityText.innerHTML = "Try to change your filters";
        } else {
            activityTitle.innerHTML = "Your activities";
            activityText.innerHTML = "<ul"
            activities.forEach(activity => {
                // If there is a link, add it to the activity
                if (activity.link)
                    activityText.innerHTML += `<li><a href="${activity.link}" target="_blank">${activity.activity}</a></li>`;
                else
                    activityText.innerHTML += `<li>${activity.activity}</li>`;
            });
            activityText.innerHTML += "</ul>"
        }
    } catch (error) {
        console.error(error);
        activityTitle.innerHTML = "Error fetching data from <a href='https://boredapi.com' target='_blank'>boredapi.com</a>";
        activityText.innerHTML = "";
    } finally {
        // Unlock the button
        unlockButton();
    }
}
