import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export interface RouteError {
  message?: string;
  retry?: () => Promise<unknown>;
}

export default function ErrorPage() {
  const error = useRouteError() as RouteError;
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate(0);
    /*if (error.retry) {
      error.retry().then(() => {
        // После успешной перезагрузки обновляем страницу
      });
    }*/
  };

  return (
    <div className="error-page">
      <h1>Ошибка!</h1>
      <p>
        Произошла непредвиденная ошибка загрузки данных для страницы. Возможно,
        у Вас возникли проблемы с Интернет? Или у нас возникли проблемы с
        сервером.
      </p>
      <p>
        <i>{error.message}</i>
      </p>
      <button onClick={handleRetry}>Попытаться еще раз!</button>
    </div>
  );
}
