'use client';

import { Typography } from 'antd';
import { TripAdminForm } from '@/components/forms/trip-admin-form';

export default function NovoEventoPage() {
  return (
    <div className="space-y-4">
      <Typography.Title level={3} style={{ margin: 0 }}>
        Novo evento
      </Typography.Title>
      <TripAdminForm mode="create" />
    </div>
  );
}
