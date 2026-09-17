import { Spinner } from "./spinner";

export function LoadingScreen() {
  return (
    <div className="checkin-loading">
      <Spinner size={48} />
    </div>
  );
}
