import { Text } from '@/components/ui/text';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

function getTimeLeft(targetDate: Date) {
  const now = new Date().getTime();
  const distance = targetDate.getTime() - now;

  const days = Math.max(Math.floor(distance / (1000 * 60 * 60 * 24)), 0);
  const hours = Math.max(Math.floor((distance / (1000 * 60 * 60)) % 24), 0);
  const minutes = Math.max(Math.floor((distance / (1000 * 60)) % 60), 0);
  const seconds = Math.max(Math.floor((distance / 1000) % 60), 0);

  return { days, hours, minutes, seconds };
}

export default function CountdownTimer({
  expiration,
  flat,
}: {
  expiration: string;
  flat?: boolean;
}) {
  const targetDate = new Date(expiration);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [expiration]);

  const renderTimeBox = (value: number, label: string) => (
    <View
      key={label}
      className="items-center justify-center bg-secondary rounded-xl w-16 h-16 mx-1">
      <Text className="text-white text-xl font-bold">{value.toString().padStart(2, '0')}</Text>
      <Text className="text-xs text-white mt-1">{label}</Text>
    </View>
  );

  if (flat) {
    return (
      <Text className="text-secondary-foreground">
        {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </Text>
    );
  }

  return (
    <View className="flex-row justify-start items-center">
      {renderTimeBox(timeLeft.days, timeLeft.days === 1 ? 'Day' : 'Days')}
      {renderTimeBox(timeLeft.hours, timeLeft.hours === 1 ? 'Hour' : 'Hours')}
      {renderTimeBox(timeLeft.minutes, timeLeft.minutes === 1 ? 'Minute' : 'Minutes')}
      {renderTimeBox(timeLeft.seconds, timeLeft.seconds === 1 ? 'Second' : 'Seconds')}
    </View>
  );
}
