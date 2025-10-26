import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Sample initial data
let foodData = {
  foodListings: [
    {
      id: 1,
      donorName: "Green Restaurant",
      foodType: "prepared_meals",
      quantity: "25 servings",
      description: "Fresh vegetable biryani and curry",
      pickupAddress: "123 Main Street, Hyderabad",
      location: [17.3850, 78.4867],
      expiryTime: "2024-01-20T21:00:00",
      status: "available",
      postedAt: new Date().toISOString()
    },
    {
      id: 2,
      donorName: "City Bakery",
      foodType: "bakery_items",
      quantity: "30 pieces",
      description: "Fresh bread and pastries",
      pickupAddress: "456 Bakery Road, Hyderabad",
      location: [17.4000, 78.5000],
      expiryTime: "2024-01-21T09:00:00",
      status: "available",
      postedAt: new Date().toISOString()
    }
  ]
};

// Get all food listings
app.get('/api/food-listings', (req, res) => {
  const availableFood = foodData.foodListings.filter(item => item.status === 'available');
  res.json(availableFood);
});

// Post new food listing
app.post('/api/food-listings', (req, res) => {
  const newListing = {
    id: foodData.foodListings.length + 1,
    ...req.body,
    status: 'available',
    postedAt: new Date().toISOString()
  };
  foodData.foodListings.push(newListing);
  res.json(newListing);
});

// Claim food
app.post('/api/claim-food/:id', (req, res) => {
  const listingId = parseInt(req.params.id);
  const listing = foodData.foodListings.find(item => item.id === listingId);
  
  if (listing) {
    listing.status = 'claimed';
    listing.claimedBy = req.body.receiverId || 'demo-receiver';
    listing.claimedAt = new Date().toISOString();
    res.json({ success: true, listing });
  } else {
    res.status(404).json({ success: false, message: 'Food listing not found' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Food Rescue Connect API is running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🍽️ Food Rescue Connect server running on port ${PORT}`);
  console.log(`📍 Frontend: http://localhost:5173`);
  console.log(`📍 Backend API: http://localhost:${PORT}`);
});