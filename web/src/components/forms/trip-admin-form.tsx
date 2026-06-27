'use client';

import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Result,
  Select,
  Spin,
  Space,
  message,
} from 'antd';
import dayjs from 'dayjs';
import {
  ApiError,
  createTrip,
  type TripMutationPayload,
  updateTrip,
  uploadTripImage,
} from '@/lib/api';
import { canAccess } from '@/lib/permissions';
import { useAuth } from '@/components/auth/auth-provider';
import type {
  Trip,
  TripAttractionType,
  TripDifficulty,
  TripExperienceType,
  TripStatus,
} from '@/types/trip';
import {
  tripAttractionTypeOptions,
  tripDifficultyOptions,
  tripExperienceTypeOptions,
} from '@/constants/trip-classification';

type Props = {
  mode: 'create' | 'edit';
  initialTrip?: Trip;
};

type FormValues = {
  title: string;
  slug: string;
  destination: string;
  eventDate: dayjs.Dayjs;
  departureTime: string;
  experienceType: TripExperienceType;
  interests: TripAttractionType[];
  price?: number;
  capacity?: number;
  difficulty: TripDifficulty;
  description?: string;
  itinerary?: string;
  includedItems?: string;
  boardingPoints?: string;
  mainImageUrl?: string;
  status: TripStatus;
};

const statusOptions: Array<{ value: TripStatus; label: string }> = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'active', label: 'Publicado' },
  { value: 'finished', label: 'Encerrado' },
  { value: 'canceled', label: 'Cancelado' },
];

function linesToArray(value?: string) {
  return value
    ?.split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function tripToInitialValues(trip?: Trip): Partial<FormValues> {
  if (!trip) {
    return {
      status: 'draft',
      experienceType: 'trail',
      interests: [],
      difficulty: 'moderate',
    };
  }

  return {
    title: trip.title,
    slug: trip.slug,
    destination: trip.destination,
    eventDate: trip.eventDate ? dayjs(trip.eventDate) : undefined,
    departureTime: trip.departureTime ?? undefined,
    experienceType: trip.experienceType,
    interests: trip.interests ?? [],
    price: trip.price ?? undefined,
    capacity: trip.capacity ?? undefined,
    difficulty: trip.difficulty,
    description: trip.description ?? trip.summary ?? undefined,
    itinerary: trip.itinerary?.join('\n'),
    includedItems: (trip.includedItems ?? trip.includes)?.join('\n'),
    boardingPoints: (trip.boardingPoints ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((boardingPoint) => boardingPoint.label)
      .join('\n'),
    mainImageUrl: trip.mainImageUrl ?? undefined,
    status: trip.status,
  };
}

export function TripAdminForm({ mode, initialTrip }: Props) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canManageEvents = canAccess(user, 'events:manage');

  const initialValues = useMemo(() => tripToInitialValues(initialTrip), [initialTrip]);
  const validateMessages = {
    required: 'O campo "${label}" é obrigatório.',
    string: {
      min: 'O campo "${label}" deve ter no mínimo ${min} caracteres.',
    },
    types: {
      email: 'Informe um e-mail válido.',
    },
    number: {
      min: 'O campo "${label}" deve ser maior ou igual a ${min}.',
    },
  };

  async function submit(values: FormValues) {
    setLoading(true);
    setError(null);

    const eventDate = values.eventDate.toDate();
    const payload: TripMutationPayload = {
      title: values.title,
      slug: values.slug,
      destination: values.destination,
      eventDate: eventDate.toISOString(),
      dateLabel: values.eventDate.format('DD/MM/YYYY'),
      departureTime: values.departureTime,
      experienceType: values.experienceType,
      interests: values.interests,
      price: values.price,
      capacity: values.capacity,
      difficulty: values.difficulty,
      description: values.description,
      summary: values.description,
      itinerary: linesToArray(values.itinerary),
      includedItems: linesToArray(values.includedItems),
      mainImageUrl: values.mainImageUrl || undefined,
      status: values.status,
      boardingPoints: linesToArray(values.boardingPoints)?.map((label, order) => ({
        label,
        order,
      })),
    };

    try {
      if (mode === 'edit' && initialTrip) {
        await updateTrip(initialTrip.id, payload);
        message.success('Evento atualizado');
      } else {
        await createTrip(payload);
        message.success('Evento criado');
      }

      router.push('/admin/eventos');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/login');
        return;
      }

      if (err instanceof ApiError && err.status === 409) {
        setError('Já existe um evento com este slug.');
        return;
      }

      if (err instanceof ApiError && err.status === 403) {
        setError('Você não tem permissão para gerenciar eventos.');
        return;
      }

      setError('Não foi possível salvar o evento.');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImageUploading(true);
    setError(null);

    try {
      const media = await uploadTripImage(file);
      form.setFieldValue('mainImageUrl', media.url);
      message.success('Imagem enviada');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.replace('/login');
        return;
      }

      if (err instanceof ApiError && err.status === 403) {
        setError('Você não tem permissão para enviar imagens.');
        return;
      }

      setError('Não foi possível enviar a imagem.');
    } finally {
      setImageUploading(false);
      event.target.value = '';
    }
  }

  if (isAuthLoading) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center">
        <Spin size="large" />
      </main>
    );
  }

  if (!canManageEvents) {
    return (
      <Result
        status="403"
        title="Acesso negado"
        subTitle="Seu perfil não tem permissão para gerenciar eventos."
      />
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      validateMessages={validateMessages}
      initialValues={initialValues}
      onFinish={submit}
      className="max-w-4xl"
    >
      {error ? (
        <Alert
          className="mb-4"
          type="error"
          showIcon
          message="Erro"
          description={error}
        />
      ) : null}

      <div className="grid grid-cols-1 gap-x-4 desktop:grid-cols-2">
        <Form.Item label="Título" name="title" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Slug" name="slug" rules={[{ required: true, min: 3 }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Destino" name="destination" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item
          label="Tipo de experiência"
          name="experienceType"
          rules={[{ required: true }]}
        >
          <Select size="large" options={tripExperienceTypeOptions} />
        </Form.Item>

        <Form.Item label="Data do evento" name="eventDate" rules={[{ required: true }]}>
          <DatePicker size="large" className="w-full" format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item
          label="Horário de saída"
          name="departureTime"
          rules={[{ required: true }]}
        >
          <Input size="large" placeholder="05:30" />
        </Form.Item>

        <Form.Item
          label="Atrativos / interesses"
          name="interests"
          rules={[{ required: true }]}
        >
          <Select
            size="large"
            mode="multiple"
            maxTagCount="responsive"
            options={tripAttractionTypeOptions}
          />
        </Form.Item>

        <Form.Item label="Dificuldade" name="difficulty" rules={[{ required: true }]}>
          <Select size="large" options={tripDifficultyOptions} />
        </Form.Item>

        <Form.Item label="Preço" name="price" rules={[{ required: true }]}>
          <InputNumber className="w-full" size="large" min={0} prefix="R$" />
        </Form.Item>

        <Form.Item label="Total de vagas" name="capacity" rules={[{ required: true }]}>
          <InputNumber className="w-full" size="large" min={1} />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select size="large" options={statusOptions} />
        </Form.Item>

        <Form.Item label="Imagem principal" name="mainImageUrl">
          <Input size="large" placeholder="https://..." />
        </Form.Item>
      </div>

      <div className="mb-4 rounded-xl border border-zinc-800 p-4">
        <p className="mb-2 text-sm font-medium text-zinc-200">
          Upload da imagem principal
        </p>
        <Space wrap>
          <label className="inline-flex h-8 cursor-pointer items-center rounded-md border border-zinc-700 px-3 text-sm text-zinc-100 transition-colors hover:border-primary hover:text-primary">
            {imageUploading ? 'Enviando...' : 'Selecionar imagem'}
            <input
              hidden
              disabled={imageUploading}
              type="file"
              accept="image/*"
              onChange={(event) => void handleImageUpload(event)}
            />
          </label>
          <span className="text-sm text-zinc-400">
            Você também pode colar uma URL diretamente no campo acima.
          </span>
        </Space>
      </div>

      <Form.Item label="Descrição" name="description" rules={[{ required: true }]}>
        <Input.TextArea rows={5} />
      </Form.Item>

      <Form.Item label="Roteiro" name="itinerary" rules={[{ required: true }]}>
        <Input.TextArea rows={5} placeholder="Informe um item por linha" />
      </Form.Item>

      <Form.Item label="Itens inclusos" name="includedItems" rules={[{ required: true }]}>
        <Input.TextArea rows={4} placeholder="Informe um item por linha" />
      </Form.Item>

      <Form.Item
        label="Ponto de embarque"
        name="boardingPoints"
        rules={[{ required: true }]}
      >
        <Input.TextArea rows={4} placeholder="Informe um ponto por linha" />
      </Form.Item>

      <Space className="mt-2">
        <Button type="primary" htmlType="submit" loading={loading}>
          {mode === 'edit' ? 'Salvar alterações' : 'Criar evento'}
        </Button>
        <Button onClick={() => router.push('/admin/eventos')}>Cancelar</Button>
      </Space>
    </Form>
  );
}
