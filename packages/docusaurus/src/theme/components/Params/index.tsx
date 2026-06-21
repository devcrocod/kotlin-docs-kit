import React from 'react';
import clsx from 'clsx';
import Badge from '../Badge';

export interface ParamItem {
  name: string;
  type?: React.ReactNode;
  required?: boolean;
  description?: React.ReactNode;
}

export interface ParamsProps {
  items: ParamItem[];
  className?: string;
  headers?: [string, string];
}

export default function Params({
  items,
  className,
  headers = ['Parameter', 'Description'],
}: ParamsProps): React.ReactElement {
  return (
    <table className={clsx('kt-params', className)}>
      <thead>
        <tr>
          <th>{headers[0]}</th>
          <th>{headers[1]}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => (
          <tr key={`${item.name}-${idx}`}>
            <td>
              <code className="kt-params__name">{item.name}</code>
              {item.required ? (
                <Badge variant="danger" className="kt-params__required">
                  required
                </Badge>
              ) : null}
              {item.type ? <span className="kt-params__type">{item.type}</span> : null}
            </td>
            <td>{item.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
