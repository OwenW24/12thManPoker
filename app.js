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

// Hand strength rankings
const handStrengths = {
    "High Card": 1,
    "One Pair": 2,
    "Two Pair": 3,
    "Three of a Kind": 4,
    "Straight": 5,
    "Flush": 6,
    "Full House": 7,
    "Four of a Kind": 8,
    "Straight Flush": 9,
    "Royal Flush": 10
};

// Store the selected cards in an array
let hand = [];
const maxHandSize = 5; // Limit to 5 cards

// Get references to DOM elements
const suitInput = document.getElementById('suit-input');
const rankInput = document.getElementById('rank-input');
const addCardBtn = document.getElementById('add-card-btn');
const handElement = document.getElementById('hand');
const opponentsInput = document.getElementById('opponents-input');

// Function to add a card to the hand
function addCardToHand(suit, rankCode, rankName, rankValue) {
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

    const card = { suit, rankCode, rankName, rankValue };
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

    // Get the number of opponents from the input
    const numberOfOpponents = parseInt(opponentsInput.value) || 1;

    const probabilityResult = probability(hand);
    const winningLikelihood = likelihoodOfWinning(hand, numberOfOpponents);

    // Format the probabilities as percentages
    const handProbabilityPercentage = (probabilityResult.handProbability * 100).toFixed(6);
    const winningProbabilityPercentage = (winningLikelihood.probabilityWinning * 100).toFixed(2);

    resultElement.innerHTML = `
        You have a <strong>${handName}</strong>!<br>
        Probability of this hand: <strong>${handProbabilityPercentage}%</strong><br>
        Estimated likelihood of winning against ${numberOfOpponents} opponent(s): <strong>${winningProbabilityPercentage}%</strong>
    `;
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

    return {
        suit: fullSuit,
        rankCode: rankData.code,
        rankName: rankData.name,
        rankValue: rankData.value // Ensure rankValue is a number
    };
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
        addCardToHand(
            validatedInput.suit,
            validatedInput.rankCode,
            validatedInput.rankName,
            validatedInput.rankValue
        );
        // Clear input fields after adding the card
        suitInput.value = '';
        rankInput.value = '';
    }
});

// Function to evaluate the hand
function evaluateHand(hand) {
    const rankValues = hand.map(card => Number(card.rankValue));
    const suits = hand.map(card => card.suit);

    // Sort rank values
    rankValues.sort((a, b) => a - b);

    // Count occurrences
    const rankCounts = {};
    const suitCounts = {};

    rankValues.forEach(value => {
        rankCounts[value] = (rankCounts[value] || 0) + 1;
    });

    suits.forEach(suit => {
        suitCounts[suit] = (suitCounts[suit] || 0) + 1;
    });

    const isFlush = Object.keys(suitCounts).length === 1;

    const isStraight = rankValues.every((value, index) => {
        if (index === 0) return true;
        return value === rankValues[index - 1] + 1;
    });

    // Special case for Ace-low straight
    const lowAceStraight = [2, 3, 4, 5, 14];
    const isLowAceStraight = rankValues.join(',') === lowAceStraight.join(',');

    const counts = Object.values(rankCounts).sort((a, b) => b - a);

    if (isFlush && isStraight && rankValues[0] === 10) {
        return "Royal Flush";
    } else if (isFlush && (isStraight || isLowAceStraight)) {
        return "Straight Flush";
    } else if (counts[0] === 4) {
        return "Four of a Kind";
    } else if (counts[0] === 3 && counts[1] === 2) {
        return "Full House";
    } else if (isFlush) {
        return "Flush";
    } else if (isStraight || isLowAceStraight) {
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

// Function to calculate the probability of the hand
function probability(hand) {
    const totalHands = 2598960; // Total possible 5-card hands
    const handName = evaluateHand(hand);

    // Frequencies of each hand type
    const handFrequencies = {
        "Royal Flush": 4,
        "Straight Flush": 36,
        "Four of a Kind": 624,
        "Full House": 3744,
        "Flush": 5108,
        "Straight": 10200,
        "Three of a Kind": 54912,
        "Two Pair": 123552,
        "One Pair": 1098240,
        "High Card": 1302540
    };

    const frequency = handFrequencies[handName];

    // Calculate the probability
    const handProbability = frequency / totalHands;

    return { handName, handProbability };
}

// Function to estimate the likelihood of winning
function likelihoodOfWinning(hand, numberOfOpponents = 1) {
    const totalHands = 2598960;
    const handName = evaluateHand(hand);
    const handRank = handStrengths[handName];

    // Frequencies of each hand type
    const handFrequencies = {
        "Royal Flush": 4,
        "Straight Flush": 36,
        "Four of a Kind": 624,
        "Full House": 3744,
        "Flush": 5108,
        "Straight": 10200,
        "Three of a Kind": 54912,
        "Two Pair": 123552,
        "One Pair": 1098240,
        "High Card": 1302540
    };

    // Sum frequencies of hands stronger than the user's hand
    let strongerHandsFrequency = 0;
    for (let [name, frequency] of Object.entries(handFrequencies)) {
        if (handStrengths[name] > handRank) {
            strongerHandsFrequency += frequency;
        }
    }

    // Probability that an opponent has a stronger hand
    const probabilityStrongerHand = strongerHandsFrequency / totalHands;

    // Probability that an opponent does not have a stronger hand
    const probabilityNotStrongerHand = 1 - probabilityStrongerHand;

    // Probability of winning against all opponents
    const probabilityWinning = Math.pow(probabilityNotStrongerHand, numberOfOpponents);

    return { handName, probabilityWinning };
}

// Optional: Update results when number of opponents changes
function updateResults() {
    if (hand.length === maxHandSize) {
        const handName = evaluateHand(hand);
        displayHandResult(handName);
    }
}

// Add event listener to the opponents input field if you wish to update results dynamically
opponentsInput.addEventListener('change', updateResults);
