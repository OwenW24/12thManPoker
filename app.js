// Mapping of suit abbreviations to full names
const suitMapping = {
    'H': 'Hearts',
    'D': 'Diamonds',
    'C': 'Clubs',
    'S': 'Spades',
    'HEARTS': 'Hearts',
    'DIAMONDS': 'Diamonds',
    'CLUBS': 'Clubs',
    'SPADES': 'Spades'
};

// Mapping of rank inputs to standardized data
const rankMapping = {
    'A': { code: 'A', name: 'Ace', value: 14 },
    'ACE': { code: 'A', name: 'Ace', value: 14 },
    '2': { code: '2', name: '2', value: 2 },
    '3': { code: '3', name: '3', value: 3 },
    '4': { code: '4', name: '4', value: 4 },
    '5': { code: '5', name: '5', value: 5 },
    '6': { code: '6', name: '6', value: 6 },
    '7': { code: '7', name: '7', value: 7 },
    '8': { code: '8', name: '8', value: 8 },
    '9': { code: '9', name: '9', value: 9 },
    '10': { code: '10', name: '10', value: 10 },
    'J': { code: 'J', name: 'Jack', value: 11 },
    'JACK': { code: 'J', name: 'Jack', value: 11 },
    'Q': { code: 'Q', name: 'Queen', value: 12 },
    'QUEEN': { code: 'Q', name: 'Queen', value: 12 },
    'K': { code: 'K', name: 'King', value: 13 },
    'KING': { code: 'K', name: 'King', value: 13 }
};

// Store the selected cards in an array
let hand = [];
const maxHandSize = 5; // Limit to 5 cards

// Get references to DOM elements
const suitInput = document.getElementById('suit-input');
const rankInput = document.getElementById('rank-input');
const addCardBtn = document.getElementById('add-card-btn');
const handElement = document.getElementById('hand');

// Function to add a card to the hand
function addCardToHand(suit, rankCode, rankName) {
    if (hand.length >= maxHandSize) {
        alert("Your hand is full! You can't select more than 5 cards.");
        return;
    }

    // Check for duplicate cards
    const cardExists = hand.some(card => card.suit === suit && card.rankCode === rankCode);
    if (cardExists) {
        alert("You have already added this card to your hand.");
        return;
    }

    const card = { suit, rankCode, rankName };
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
        cardItem.textContent = `${card.rankName} of ${card.suit}`;
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
    const suitInputNormalized = suit.trim().toUpperCase();
    const rankInputNormalized = rank.trim().toUpperCase();

    // Convert suit input to full suit name
    const fullSuit = suitMapping[suitInputNormalized] || suitMapping[suitInputNormalized.charAt(0)];

    if (!fullSuit) {
        alert(`Invalid suit entered. Please enter one of the following: Hearts (H), Diamonds (D), Clubs (C), Spades (S)`);
        return null;
    }

    // Convert rank input to standardized data
    const rankData = rankMapping[rankInputNormalized];

    if (!rankData) {
        alert(`Invalid rank entered. Please enter one of the following: A (Ace), 2-10, J (Jack), Q (Queen), K (King)`);
        return null;
    }

    return { suit: fullSuit, rankCode: rankData.code, rankName: rankData.name, rankValue: rankData.value };
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
        addCardToHand(validatedInput.suit, validatedInput.rankCode, validatedInput.rankName);
        // Clear input fields after adding the card
        suitInput.value = '';
        rankInput.value = '';
    }
});

function evaluateHand(hand) {
    // Extract suits and rank values
    const suits = hand.map(card => card.suit);
    const rankValues = hand.map(card => card.rankValue);

    // Sort rank values for straight checking
    rankValues.sort((a, b) => a - b);

    // Count occurrences of each rank value and suit
    const rankCounts = {};
    const suitCounts = {};

    for (let value of rankValues) {
        rankCounts[value] = (rankCounts[value] || 0) + 1;
    }

    for (let suit of suits) {
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    }

    // Check for flush (all cards have the same suit)
    const isFlush = Object.keys(suitCounts).length === 1;

    // Check for straight
    const isSequential = rankValues.every((value, index) => {
        if (index === 0) return true;
        return value === rankValues[index - 1] + 1;
    });

    // Special case: Low Ace Straight (A, 2, 3, 4, 5)
    const lowAceStraight = [2, 3, 4, 5, 14];
    const isLowAceStraight = rankValues.join(',') === lowAceStraight.join(',');

    // Check for Royal Flush
    const isRoyal = isFlush && isSequential && rankValues[0] === 10;

    // Count of rank occurrences
    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    // Determine the hand ranking
    if (isRoyal) {
        return "Royal Flush";
    } else if (isFlush && (isSequential || isLowAceStraight)) {
        return "Straight Flush";
    } else if (counts[0] === 4) {
        return "Four of a Kind";
    } else if (counts[0] === 3 && counts[1] === 2) {
        return "Full House";
    } else if (isFlush) {
        return "Flush";
    } else if (isSequential || isLowAceStraight) {
        return "Straight";
    } else if (counts[0] === 3) {
        return "Three of a Kind";
    } else if (counts[0] === 2 && counts[1] === 2) {
        return "Two Pair";
    } else if (counts[0] === 2) {
        return "One Pair";
    } else {
        return "High Card";
    }
}

function probability(hand){

    
}