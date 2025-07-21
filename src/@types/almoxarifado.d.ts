// Enum para materiais
type MaterialType =
  | "Titânio"
  | "Plástico"
  | "Zircônia"
  | "Cobalto-Cromo"
  | "Tecido"
  | "Outro";

// Enum para status de envio
type ShipmentStatus = "PENDENTE" | "ENVIADO" | "ENTREGUE" | "CANCELADO";

// Enum de conexão dos componentes
type ConnectionType = "CM" | "HE" | "HI" | "Outro";

// Categoria geral dos itens
type ALMOXARIFADO_CATEGORY =
  | "Implante"
  | "Componente Protético"
  | "Material Clínico"
  | "Outros";

// Subcategorias específicas
type ALMOXARIFADO_SUBCATEGORY =
  // COMPONENTES PROTÉTICOS
  | "Calcinável Reto"
  | "Calcinável Angulado"
  | "Pilar Cônico"
  | "Pilar Estético"
  | "Pilar UCLA"
  | "Pilar Multiunit"
  | "Mini Pilar"
  | "Pilar Angulado 15º"
  | "Pilar Angulado 17º"
  | "Pilar Angulado 30º"
  | "Parafuso Protético"
  | "Parafuso Pilar"
  | "Parafuso Cicatrizador"
  | "Parafuso Multiunit"
  | "Transferente Aberto"
  | "Transferente Fechado"
  | "Transferente Multiunit"
  | "Analógico Externo"
  | "Analógico Interno"
  | "Analógico Cone Morse"
  | "Cicatrizador Curto"
  | "Cicatrizador Médio"
  | "Cicatrizador Longo"
  | "Cicatrizador Anatômico"
  | "Base Metálica"
  | "Cofragem"

  // IMPLANTES
  | "Implante Cone Morse"
  | "Implante Hexágono Interno"
  | "Implante Hexágono Externo"
  | "Implante Cilíndrico"
  | "Implante Cônico"
  | "Implante Curto"
  | "Implante Zigomático"
  | "Implante Unitário"
  | "Tapa Implante"

  // MATERIAIS CLÍNICOS
  | "Luva Procedimento"
  | "Luva Cirúrgica"
  | "Gaze Estéril"
  | "Gaze Não Estéril"
  | "Campo Operatório"
  | "Mascara Cirúrgica"
  | "Touca Descartável"
  | "Avental Cirúrgico"
  | "Seringa Carpule"
  | "Agulha Longa"
  | "Agulha Curta"
  | "Anestésico"
  | "Cimento Cirúrgico"
  | "Fita Hemostática"
  | "Bisturi"
  | "Lamina de Bisturi"
  | "Caneta de Alta Rotação"
  | "Broca"
  | "Fresa"
  | "Espelho Clínico"
  | "Sugador"
  | "Cânula"
  | "Sugador Cirúrgico"
  | "Porta Agulha"
  | "Pinça Clinica"
  | "Cureta"
  | "Elevador Periostal"

  // OUTROS
  | "Caixa Cirúrgica"
  | "Chave Torquímetro"
  | "Chave Hexagonal"
  | "Chave de Inserção"
  | "Kit Cirúrgico"
  | "Outro";

// Fornecedor
type Supplier = {
  id: string;
  name: string;
  contactEmail?: string;
  contactPhone?: string;
  cnpj?: string;
  address?: string;
};

// Categoria
type Category = {
  id: string;
  name: ALMOXARIFADO_CATEGORY;
};

// Subcategoria
type Subcategory = {
  id: string;
  name: SubcategoryType;
  categoryId: ALMOXARIFADO_SUBCATEGORY;
};

// Item genérico de almoxarifado
type Item = {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  subcategoryId?: string;
  material: MaterialType;
  platform?: string; // ex: 3.5, 4.1
  connectionType?: ConnectionType;
  angulation?: number;
  supplierId?: string;
  // Campos específicos para implantes
  isImplant?: boolean;
  diameterMM?: number; // ex: 3.5
  lengthMM?: number; // ex: 7, 10, 13
};

// Almoxarifado físico
type Warehouse = {
  id: string;
  name: string;
  location: string;
};

// Estoque
type Inventory = {
  id: string;
  itemId: string;
  warehouseId: string;
  quantity: number;
  lotNumber?: string;
  expirationDate?: string;
  createdAt: string;
  updatedAt: string;
};

// Dentista (destinatário dos envios)
type Dentist = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  clinicName?: string;
  address: string;
  city: string;
  state: string;
  cep: string;
};

// Envio
type Shipment = {
  id: string;
  dentistId: string;
  warehouseId: string;
  shippedAt: string;
  status: ShipmentStatus;
  trackingCode?: string;
  notes?: string;
};

// Itens dentro de um envio
type ShipmentItem = {
  id: string;
  shipmentId: string;
  itemId: string;
  quantity: number;
};
