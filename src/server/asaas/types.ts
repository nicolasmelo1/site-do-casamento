export type BillingTypes =
  | "BOLETO"
  | "CREDIT_CARD"
  | "UNDEFINED"
  | "PIX"
  | "DEBIT_CARD"
  | "TRANSFER"
  | "DEPOSIT";
export type PaymentStatus =
  | "PENDING"
  | "RECEIVED"
  | "CONFIRMED"
  | "OVERDUE"
  | "REFUNDED"
  | "RECEIVED_IN_CASH"
  | "REFUND_REQUESTED"
  | "REFUND_IN_PROGRESS"
  | "CHARGEBACK_REQUESTED"
  | "CHARGEBACK_DISPUTE"
  | "AWAITING_CHARGEBACK_REVERSAL"
  | "DUNNING_REQUESTED"
  | "DUNNING_RECEIVED"
  | "AWAITING_RISK_ANALYSIS";

export type ListingResponse<TType> = {
  /** Tipo de objeto */
  object: string;
  /** Indica se há mais uma página a ser buscada */
  hasMore: boolean;
  /** Quantidade total de itens para os filtros informados */
  totalCount: number;
  /** Quantidade de objetos por página */
  limit: number;
  /** Posição do objeto a partir do qual a página deve ser carregada */
  offset: number;
  /** Lista de objetos */
  data: TType[];
};

export type Payments = {
  /** Tipo de objeto */
  object: string;
  /** Identificador único da cobrança no Asaas */
  id: string;
  /** Identificador único do cliente ao qual a cobrança pertence */
  customer: string;
  /** Data de criação da cobrança */
  dateCreated: string;
  /** Data de vencimento da cobrança */
  dueDate: string;
  /** Identificador único da assinatura (quando cobrança recorrente) */
  installment: string;
  /** Identificador único do parcelamento (quando cobrança parcelada) */
  subscription: string;
  /** Identificador único do link de pagamentos ao qual a cobrança pertence */
  paymentLink: string;
  /** Valor da cobrança */
  value: number;
  /** Valor líquido da cobrança após desconto da tarifa do Asaas */
  netValue: number;
  /** Forma de pagamento */
  billingType: BillingTypes;
  /** Status da cobrança */
  status: PaymentStatus;
  /** Descrição da cobrança */
  description: string;
  /** Campo livre para busca */
  externalReference: string;
  /** Informa se a cobrança pode ser paga após o vencimento (Somente para boleto) */
  canBePaidAfterDueDate: boolean;
  /** Identificador único da transação Pix à qual a cobrança pertence */
  pixTransaction: string;
  /** Determina se a cobrança foi removida */
  deleted: boolean;
};

export type PaymentListingResponse = ListingResponse<Payments>;
