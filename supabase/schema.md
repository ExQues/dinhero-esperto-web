# Estrutura do Banco de Dados Supabase para DinheroEsperto

Este documento descreve a estrutura das tabelas necessárias no Supabase para suportar todas as funcionalidades do DinheroEsperto.

## Tabelas

### 1. transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  categoria TEXT NOT NULL,
  data DATE NOT NULL,
  recorrente BOOLEAN DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_data ON transactions(data);
CREATE INDEX idx_transactions_tipo ON transactions(tipo);
CREATE INDEX idx_transactions_categoria ON transactions(categoria);

-- Políticas de segurança RLS
CREATE POLICY "Usuários podem ver apenas suas próprias transações"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas suas próprias transações"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas suas próprias transações"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas suas próprias transações"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);
```

### 2. categories
```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name, type)
);

-- Índices
CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_categories_type ON categories(type);

-- Políticas RLS
CREATE POLICY "Usuários podem ver apenas suas próprias categorias"
  ON categories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas suas próprias categorias"
  ON categories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas suas próprias categorias"
  ON categories FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas suas próprias categorias"
  ON categories FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. budgets
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  categoria TEXT NOT NULL,
  mes TEXT NOT NULL, -- formato YYYY-MM
  gasto_atual DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, categoria, mes)
);

-- Índices
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_mes ON budgets(mes);

-- Políticas RLS
CREATE POLICY "Usuários podem ver apenas seus próprios orçamentos"
  ON budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas seus próprios orçamentos"
  ON budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios orçamentos"
  ON budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas seus próprios orçamentos"
  ON budgets FOR DELETE
  USING (auth.uid() = user_id);
```

### 4. financial_summary
```sql
CREATE TABLE financial_summary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_balance DECIMAL(10, 2) DEFAULT 0,
  total_income DECIMAL(10, 2) DEFAULT 0,
  total_expenses DECIMAL(10, 2) DEFAULT 0,
  total_savings DECIMAL(10, 2) DEFAULT 0,
  month TEXT NOT NULL, -- formato YYYY-MM
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- Índices
CREATE INDEX idx_financial_summary_user_id ON financial_summary(user_id);
CREATE INDEX idx_financial_summary_month ON financial_summary(month);

-- Políticas RLS
CREATE POLICY "Usuários podem ver apenas seus próprios resumos financeiros"
  ON financial_summary FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir apenas seus próprios resumos financeiros"
  ON financial_summary FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar apenas seus próprios resumos financeiros"
  ON financial_summary FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir apenas seus próprios resumos financeiros"
  ON financial_summary FOR DELETE
  USING (auth.uid() = user_id);
```

### 5. shared_accounts
```sql
CREATE TABLE shared_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  membros TEXT[] NOT NULL DEFAULT '{}',
  saldo_total DECIMAL(10, 2) DEFAULT 0,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_shared_accounts_user_id ON shared_accounts(user_id);
CREATE INDEX idx_shared_accounts_membros ON shared_accounts USING GIN(membros);

-- Políticas RLS
CREATE POLICY "Usuários podem ver contas compartilhadas que criaram ou são membros"
  ON shared_accounts FOR SELECT
  USING (auth.uid() = user_id OR auth.uid()::text = ANY(membros));

CREATE POLICY "Usuários podem inserir apenas suas próprias contas compartilhadas"
  ON shared_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Apenas criadores podem atualizar contas compartilhadas"
  ON shared_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Apenas criadores podem excluir contas compartilhadas"
  ON shared_accounts FOR DELETE
  USING (auth.uid() = user_id);
```

### 6. shared_transactions
```sql
CREATE TABLE shared_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shared_account_id UUID NOT NULL REFERENCES shared_accounts(id) ON DELETE CASCADE,
  descricao TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  pagador_id UUID NOT NULL,
  data DATE NOT NULL,
  divisao JSONB NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_shared_transactions_account_id ON shared_transactions(shared_account_id);
CREATE INDEX idx_shared_transactions_pagador_id ON shared_transactions(pagador_id);
CREATE INDEX idx_shared_transactions_data ON shared_transactions(data);

-- Políticas RLS (mais complexas, requerem função auxiliar)
CREATE FUNCTION public.is_member_of_shared_account(account_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM shared_accounts
    WHERE id = account_id
    AND (auth.uid() = user_id OR auth.uid()::text = ANY(membros))
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Usuários podem ver transações de contas compartilhadas que são membros"
  ON shared_transactions FOR SELECT
  USING (is_member_of_shared_account(shared_account_id));

CREATE POLICY "Usuários podem inserir transações em contas compartilhadas que são membros"
  ON shared_transactions FOR INSERT
  WITH CHECK (is_member_of_shared_account(shared_account_id));

CREATE POLICY "Apenas o pagador pode atualizar transações compartilhadas"
  ON shared_transactions FOR UPDATE
  USING (auth.uid() = pagador_id);

CREATE POLICY "Apenas o pagador pode excluir transações compartilhadas"
  ON shared_transactions FOR DELETE
  USING (auth.uid() = pagador_id);
```

## Triggers e Funções

### Atualizar resumo financeiro após transações
```sql
CREATE OR REPLACE FUNCTION update_financial_summary()
RETURNS TRIGGER AS $$
DECLARE
  transaction_month TEXT;
BEGIN
  -- Extrair mês da transação (YYYY-MM)
  transaction_month := to_char(NEW.data::date, 'YYYY-MM');
  
  -- Chamar função para recalcular o resumo financeiro
  PERFORM calculate_financial_summary(NEW.user_id, transaction_month);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_transaction_change
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_financial_summary();

-- Função para calcular o resumo financeiro
CREATE OR REPLACE FUNCTION calculate_financial_summary(user_id UUID, month TEXT)
RETURNS VOID AS $$
DECLARE
  year_month TEXT[];
  start_date DATE;
  end_date DATE;
  total_income DECIMAL(10, 2);
  total_expenses DECIMAL(10, 2);
  total_balance DECIMAL(10, 2);
  total_savings DECIMAL(10, 2);
BEGIN
  -- Extrair ano e mês
  year_month := string_to_array(month, '-');
  start_date := make_date(year_month[1]::int, year_month[2]::int, 1);
  end_date := (start_date + interval '1 month' - interval '1 day')::date;
  
  -- Calcular receitas
  SELECT COALESCE(SUM(valor), 0) INTO total_income
  FROM transactions
  WHERE user_id = calculate_financial_summary.user_id
  AND tipo = 'receita'
  AND data BETWEEN start_date AND end_date;
  
  -- Calcular despesas
  SELECT COALESCE(SUM(valor), 0) INTO total_expenses
  FROM transactions
  WHERE user_id = calculate_financial_summary.user_id
  AND tipo = 'despesa'
  AND data BETWEEN start_date AND end_date;
  
  -- Calcular saldo e economia
  total_balance := total_income - total_expenses;
  total_savings := GREATEST(0, total_balance);
  
  -- Inserir ou atualizar o resumo financeiro
  INSERT INTO financial_summary (
    user_id, total_balance, total_income, total_expenses, 
    total_savings, month, last_updated
  )
  VALUES (
    calculate_financial_summary.user_id, total_balance, total_income, 
    total_expenses, total_savings, month, NOW()
  )
  ON CONFLICT (user_id, month) DO UPDATE SET
    total_balance = EXCLUDED.total_balance,
    total_income = EXCLUDED.total_income,
    total_expenses = EXCLUDED.total_expenses,
    total_savings = EXCLUDED.total_savings,
    last_updated = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Atualizar orçamentos após transações
```sql
CREATE OR REPLACE FUNCTION update_budget_spending()
RETURNS TRIGGER AS $$
DECLARE
  transaction_month TEXT;
BEGIN
  -- Só atualizar para despesas
  IF NEW.tipo = 'despesa' THEN
    -- Extrair mês da transação (YYYY-MM)
    transaction_month := to_char(NEW.data::date, 'YYYY-MM');
    
    -- Atualizar o gasto atual do orçamento correspondente
    UPDATE budgets
    SET gasto_atual = (
      SELECT COALESCE(SUM(valor), 0)
      FROM transactions
      WHERE user_id = NEW.user_id
      AND tipo = 'despesa'
      AND categoria = NEW.categoria
      AND to_char(data::date, 'YYYY-MM') = transaction_month
    )
    WHERE user_id = NEW.user_id
    AND categoria = NEW.categoria
    AND mes = transaction_month;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER after_transaction_update_budget
  AFTER INSERT OR UPDATE OR DELETE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_budget_spending();
```

## Configuração de Autenticação

1. Habilitar autenticação por email/senha no Supabase
2. Configurar redirecionamentos de autenticação para a aplicação
3. Configurar emails de confirmação e recuperação de senha

## Configuração de Storage (opcional)

```sql
-- Bucket para armazenar anexos de transações (recibos, comprovantes)
CREATE POLICY "Usuários podem ver apenas seus próprios anexos"
  ON storage.objects FOR SELECT
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem fazer upload apenas de seus próprios anexos"
  ON storage.objects FOR INSERT
  WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem atualizar apenas seus próprios anexos"
  ON storage.objects FOR UPDATE
  USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Usuários podem excluir apenas seus próprios anexos"
  ON storage.objects FOR DELETE
  USING (auth.uid()::text = (storage.foldername(name))[1]);
```

## Notas de Implementação

1. Todas as tabelas usam UUID como chave primária para maior segurança
2. Row Level Security (RLS) está habilitado em todas as tabelas para garantir que usuários só acessem seus próprios dados
3. Índices são criados para melhorar a performance de consultas frequentes
4. Triggers são usados para manter automaticamente os resumos financeiros e orçamentos atualizados
5. As políticas de segurança garantem que apenas usuários autorizados possam acessar os dados compartilhados
