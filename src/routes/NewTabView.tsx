import { useNavigate } from 'react-router-dom';

export function NewTabView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 items-center justify-center h-full animate-fade-in">
      <div className="flex flex-col items-center gap-2 text-sm">
        <button
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Go home
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Create new page
        </button>
      </div>
    </div>
  );
}
