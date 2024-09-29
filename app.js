// Mapping of suit abbreviations to full names
const suitMapping = {
    'H': 'Hearts',
    'D': 'Diamonds',
    'C': 'Clubs',
    'S': 'Spades',
    'Hearts': 'Hearts',
    'Diamonds': 'Diamonds',
    'Clubs': 'Clubs',
    'Spades': 'Spades'
};

// Valid ranks
const validRanks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// Store the selected cards in an array
let hand = [];
const maxHandSize = 5; // Limit to 5 cards

// Get references to DOM elements
const suitInput = document.getElementById('suit-input');
const rankInput = document.getElementById('rank-input');
const addCardBtn = document.getElementById('add-card-btn');
const handElement = document.getElementById('hand');

// Function to add a card to the hand
function addCardToHand(suit, rank) {
    if (hand.length >= maxHandSize) {
        alert("Your hand is full! You can't select more than 5 cards.");
        return;
    }

    // Check for duplicate cards
    const cardExists = hand.some(card => card.suit === suit && card.rank === rank);
    if (cardExists) {
        alert("You have already added this card to your hand.");
        return;
    }

    const card = { suit, rank };
    hand.push(card);
    displayHand();

    if (hand.length === maxHandSize) {
        // Evaluate the hand once 5 cards are added
        const handName = evaluateHand(hand);
        displayHandResult(handName);
    }
}

// Function to display the hand in the HTML
function displayHand() {
    handElement.innerHTML = ''; // Clear previous hand display
    hand.forEach(card => {
        const cardItem = document.createElement('li');
        cardItem.textContent = `${card.rank} of ${card.suit}`;
        handElement.appendChild(cardItem);
    });
}

// Function to display the hand result
function displayHandResult(handName) {
    const resultElement = document.getElementById('hand-result');
    resultElement.textContent = `You have a ${handName}!`;
}

// Function to validate the input
function validateInput(suit, rank) {
    const suitInputNormalized = suit.trim().charAt(0).toUpperCase() + suit.trim().slice(1).toLowerCase();
    const rankInputNormalized = rank.trim().toUpperCase();

    // Convert suit input to full suit name if it's a valid abbreviation or full name
    const fullSuit = suitMapping[suitInputNormalized] || suitMapping[suitInputNormalized.charAt(0).toUpperCase()];

    if (!fullSuit) {
        alert(`Invalid suit entered. Please enter one of the following: Hearts (H), Diamonds (D), Clubs (C), Spades (S)`);
        return null;
    }

    if (!validRanks.includes(rankInputNormalized)) {
        alert(`Invalid rank entered. Please enter one of the following: ${validRanks.join(', ')}`);
        return null;
    }

    return { suit: fullSuit, rank: rankInputNormalized };
}

// Event listener for the Add Card button
addCardBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const suitInputValue = suitInput.value;
    const rankInputValue = rankInput.value;

    if (!suitInputValue || !rankInputValue) {
        alert("Please enter both a suit and a rank.");
        return;
    }

    const validatedInput = validateInput(suitInputValue, rankInputValue);
    if (validatedInput) {
        addCardToHand(validatedInput.suit, validatedInput.rank);
        // Clear input fields after adding the card
        suitInput.value = '';
        rankInput.value = '';
    }
});

// Function to evaluate the hand (same as before)
// ... (Keep the evaluateHand function as previously defined)