// Simple seeder for habits-svc (MongoDB)
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://mongo:27017/campuswell';
const HabitSchema = new mongoose.Schema({
  studentId: Number,
  sleepHours: Number,
  exerciseMinutes: Number,
  mood: String,
  date: { type: Date, default: Date.now }
}, { collection: 'habits' });

async function main() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  const Habit = mongoose.model('Habit', HabitSchema);

  const target = 20000;
  const count = await Habit.countDocuments();
  if (count >= target) {
    console.log(`Already have ${count} docs. Skipping.`);
    await mongoose.disconnect();
    return;
  }

  const moods = ['excellent','good','neutral','bad','terrible'];
  const batchSize = 1000;
  let inserted = 0;
  while (inserted < target) {
    const batch = [];
    for (let i = 0; i < batchSize && inserted + i < target; i++) {
      const studentId = 1 + Math.floor(Math.random() * 5000);
      batch.push({
        studentId,
        sleepHours: 4 + Math.floor(Math.random() * 6),
        exerciseMinutes: Math.floor(Math.random() * 90),
        mood: moods[Math.floor(Math.random() * moods.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 90) * 86400000)
      });
    }
    await Habit.insertMany(batch, { ordered: false });
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${target}`);
  }

  const total = await Habit.countDocuments();
  console.log(`Total documents: ${total}`);
  await mongoose.disconnect();
}

main().catch(async (e) => {
  console.error(e);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});


