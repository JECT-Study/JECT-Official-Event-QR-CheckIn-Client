type LoadingScreenProps = {
  message: string;
};

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className="checkin-loading" role="status">
      {message}
    </div>
  );
}
