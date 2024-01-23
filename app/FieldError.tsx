import classNames from 'classnames';

export function FieldError({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={classNames('text-red-500 text-sm', {
        [className]: !!className,
      })}
    >
      {text}
    </div>
  );
}


  