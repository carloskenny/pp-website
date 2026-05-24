'use client';

import Link from 'next/link';
import { Button, Drawer, Space } from 'antd';
import { useState } from 'react';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Abrir menu"
        className="flex h-7 w-9 flex-col justify-between"
        onClick={() => setOpen(true)}
      >
        <span className="h-1 w-9 rounded bg-white" />
        <span className="h-1 w-9 rounded bg-white" />
        <span className="h-1 w-9 rounded bg-white" />
      </button>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Space direction="vertical" className="w-full">
          <Link href="/" onClick={() => setOpen(false)}>
            <Button block>Home</Button>
          </Link>
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button block type="primary">
              Login
            </Button>
          </Link>
          <Link href="/cadastro" onClick={() => setOpen(false)}>
            <Button block>Cadastrar</Button>
          </Link>
        </Space>
      </Drawer>
    </>
  );
}
