# Tarefas Pendentes - Leju Assessoria

## Problemas Identificados

### 1. Menu Lateral
- ❌ **PROBLEMA**: Foi criado um sistema de menu colapsível que gerou sobreposição de menus
- ✅ **SOLUÇÃO**: Voltar ao menu lateral simples original, apenas com ícones coloridos
- 📍 **ARQUIVOS AFETADOS**: 
  - `src/components/Layout/AppLayout.tsx`
  - `src/components/Layout/ModernSidebar.tsx` (remover)
  - `src/components/Layout/Sidebar.tsx` (restaurar)

### 2. Edição de Convidados
- ❌ **PROBLEMA**: Botão de editar convidados não está funcionando
- ✅ **SOLUÇÃO**: Implementar modal de edição funcional
- 📍 **ARQUIVOS AFETADOS**:
  - `src/components/GuestList/EditGuestModal.tsx`
  - `src/components/GuestList/GuestListManager.tsx`

### 3. Sincronização de Dados
- ❌ **PROBLEMA**: Totais de convidados não estão sincronizados após check-in
- ✅ **SOLUÇÃO**: Corrigir mapeamento de campos do banco
- 📍 **CAMPOS**: `checked_in` → `checkedIn`, `check_in_time` → `checkInTime`

## Plano de Ação

1. **PRIMEIRO**: Restaurar menu lateral original com ícones coloridos
2. **SEGUNDO**: Garantir que edição de convidados funcione
3. **TERCEIRO**: Verificar sincronização de dados

## Status Atual
- [x] Arquivo de documentação criado
- [x] Menu lateral restaurado com ícones coloridos
- [x] Edição de convidados funcionando
- [x] ModernSidebar.tsx removido
- [x] Link correto para lista de convidados no dashboard
- [x] Todos os problemas identificados foram corrigidos