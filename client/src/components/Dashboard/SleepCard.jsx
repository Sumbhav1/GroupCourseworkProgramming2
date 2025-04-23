import { Circle } from 'rc-progress';

function getTimeUntilBed(bedtime) {
  const now = new Date();
  const bed = new Date();

  const [bedHour, bedMin] = bedtime.split(':');
  bed.setHours(parseInt(bedHour));
  bed.setMinutes(parseInt(bedMin));
  bed.setSeconds(0);

  if (bed < now) bed.setDate(bed.getDate() + 1); // Handle past-bedtime case

  const diffMs = bed - now;
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const hoursLeft = Math.floor(diffMin / 60);
  const minutesLeft = diffMin % 60;

  const totalDayMinutes = 24 * 60;
  const percentage = ((totalDayMinutes - diffMin) / totalDayMinutes) * 100;

  return {
    timeRemaining: `${hoursLeft}h ${minutesLeft}m`,
    percentage,
  };
}

const SleepCard = ({ bedtime = '22:00', wakeupTime = '06:30' }) => {
  const { timeRemaining, percentage } = getTimeUntilBed(bedtime);

  return (
    <div className="bg-blue-100 p-4 rounded-2xl shadow-md w-full max-w-xs text-center text-blue-900">
      <h2 className="text-sm font-bold tracking-widest mb-2">SLEEP</h2>

      <div className="relative w-24 h-24 mx-auto mb-2">
        <Circle
          percent={percentage}
          strokeWidth={8}
          strokeColor="#0ea5e9"
          trailColor="#bae6fd"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-sm font-semibold">
          <div>{timeRemaining}</div>
          <div className="text-xs text-blue-800">until bed</div>
        </div>
      </div>

      <div className="text-sm space-y-1">
        <p><span className="font-medium">Bed Time:</span> {bedtime}</p>
        <p><span className="font-medium">Wake Time:</span> {wakeupTime}</p>
      </div>
    </div>
  );
};

export default SleepCard;


