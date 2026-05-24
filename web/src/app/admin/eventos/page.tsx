'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { createTrip, deleteTrip, getTrips, updateTrip } from '@/lib/api';
import type { Trip } from '@/types/trip';

type FormValues = {
  slug: string;
  title: string;
  destination: string;
  dateLabel: string;
  status: Trip['status'];
  price?: number;
  capacity?: number;
};

export default function AdminEventosPage() {
  const [items, setItems] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Trip | null>(null);
  const [form] = Form.useForm<FormValues>();

  async function loadTrips() {
    setLoading(true);
    try {
      setItems(await getTrips());
    } catch {
      message.error('Falha ao carregar eventos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTrips();
  }, []);

  function openCreate() {
    setEditing(null);
    form.resetFields();
    form.setFieldsValue({ status: 'draft' });
    setIsOpen(true);
  }

  function openEdit(item: Trip) {
    setEditing(item);
    form.setFieldsValue({
      slug: item.slug,
      title: item.title,
      destination: item.destination,
      dateLabel: item.dateLabel,
      status: item.status,
      price: item.price ?? undefined,
      capacity: item.capacity ?? undefined,
    });
    setIsOpen(true);
  }

  async function submit(values: FormValues) {
    try {
      if (editing) {
        await updateTrip(editing.id, values);
        message.success('Evento atualizado');
      } else {
        await createTrip(values);
        message.success('Evento criado');
      }
      setIsOpen(false);
      await loadTrips();
    } catch {
      message.error('Não foi possível salvar o evento');
    }
  }

  async function remove(id: string) {
    try {
      await deleteTrip(id);
      message.success('Evento removido');
      await loadTrips();
    } catch {
      message.error('Não foi possível remover o evento');
    }
  }

  const columns = useMemo<ColumnsType<Trip>>(
    () => [
      { title: 'Título', dataIndex: 'title', key: 'title' },
      { title: 'Data', dataIndex: 'dateLabel', key: 'dateLabel' },
      { title: 'Destino', dataIndex: 'destination', key: 'destination' },
      { title: 'Status', dataIndex: 'status', key: 'status' },
      {
        title: 'Ações',
        key: 'actions',
        render: (_, record) => (
          <Space>
            <Button size="small" onClick={() => openEdit(record)}>
              Editar
            </Button>
            <Popconfirm
              title="Remover evento?"
              onConfirm={() => remove(record.id)}
              okText="Sim"
              cancelText="Não"
            >
              <Button size="small" danger>
                Remover
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [],
  );

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1100px] px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
          Admin • Eventos
        </Typography.Title>
        <Button type="primary" onClick={openCreate}>
          Novo evento
        </Button>
      </div>

      <Table
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 900 }}
      />

      <Modal
        open={isOpen}
        title={editing ? 'Editar evento' : 'Novo evento'}
        onCancel={() => setIsOpen(false)}
        onOk={() => form.submit()}
        okText="Salvar"
      >
        <Form form={form} layout="vertical" onFinish={submit}>
          <Form.Item label="Slug" name="slug" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Título" name="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Destino"
            name="destination"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Data"
            name="dateLabel"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="status" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'active', label: 'Active' },
                { value: 'sold_out', label: 'Sold out' },
                { value: 'finished', label: 'Finished' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Valor" name="price">
            <InputNumber className="w-full" min={0} />
          </Form.Item>
          <Form.Item label="Capacidade" name="capacity">
            <InputNumber className="w-full" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  );
}
