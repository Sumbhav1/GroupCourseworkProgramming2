import { useState } from 'react';
import axios from 'axios';

const moods = [
  { label: 'Happy', emoji: '😄' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Sad', emoji: '😢' },
  { label: 'Stressed', emoji: '😣' },
  { label: 'Angry', emoji: '😠' },
];

const MoodSelector = ({ initialMood, email
 }) => {
  const [selectedMood, setSelectedMood] = useState(initialMood);

  const handleMoodClick = async (mood) => {
    setSelectedMood(mood);
    try {
      await axios.post("http://localhost:5001/mood/set", { mood,email}); // Adjust endpoint as needed
    } catch (error) {
      console.error('Failed to update mood:', error);
    }
  };

  return (
    <div className="bg-yellow-100 p-4 rounded-2xl shadow-md w-full max-w-xs text-center text-yellow-900">
      <h2 className="text-sm font-bold tracking-widest mb-3">HOW ARE YOU FEELING?</h2>
      <div className="flex justify-around items-center space-x-2">
        {moods.map(({ label, emoji }) => (
          <button
            key={label}
            onClick={() => handleMoodClick(label)}
            className={`text-3xl transition-transform transform hover:scale-125 ${
              selectedMood === label ? 'ring-2 ring-yellow-500 rounded-full' : ''
            }`}
            title={label}
          >
            {emoji}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="mt-2 text-sm text-yellow-800">You feel: <strong>{selectedMood}</strong></p>
      )}
    </div>
  );
};

export default MoodSelector;
