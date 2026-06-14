'use client';

import { Card, Col, Row } from 'antd';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-admin-text">Dashboard</h1>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card title="Eventos">Visão rápida de trips ativas.</Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Reservas">Acompanhe novas pré-reservas e status.</Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title="Parceiros">Controle de acesso e cadastros.</Card>
        </Col>
      </Row>
    </div>
  );
}
