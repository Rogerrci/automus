import React, { useState, useRef, useEffect } from 'react';
import { Plus, Download, Trash2 } from 'lucide-react';
import type { Product } from './types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [projectName, setProjectName] = useState('');
  const [showModal, setShowModal] = useState(true);
  const [newProduct, setNewProduct] = useState<Product>({
    code: '',
    description: '',
    quantity: 0
  });

  const modalInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const quantityInputRef = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (showModal && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [showModal]);

  useEffect(() => {
    if (!showModal && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [showModal]);

  const handleProjectNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      setShowModal(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'code' | 'description' | 'quantity') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      switch (field) {
        case 'code':
          descriptionInputRef.current?.focus();
          break;
        case 'description':
          quantityInputRef.current?.focus();
          break;
        case 'quantity':
          submitButtonRef.current?.click();
          break;
      }
    }
  };

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.code || !newProduct.description) return;
    
    setProducts([...products, newProduct]);
    setNewProduct({ code: '', description: '', quantity: 0 });
    
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  const removeProduct = (code: string) => {
    setProducts(products.filter(p => p.code !== code));
  };

  const exportCSV = () => {
    const BOM = '\uFEFF';
    const now = new Date().toLocaleString('pt-BR', { 
      timeZone: 'America/Sao_Paulo',
      dateStyle: 'short',
      timeStyle: 'medium'
    });
    
    const csvContent = products
      .map(p => `${p.code};${p.description};${p.quantity}`)
      .join('\n');
    
    const header = 'Código;Descrição;Quantidade\n';
    const blob = new Blob([BOM + header + csvContent], { 
      type: 'text/csv;charset=utf-8'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${projectName.trim()}_${now.replace(/[/: ]/g, '_')}.csv`;
    link.click();
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Nome do Projeto</h2>
          <form onSubmit={handleProjectNameSubmit}>
            <input
              ref={modalInputRef}
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
              placeholder="Digite o nome do projeto"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Começar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciador de Produtos</h1>
          <h2 className="text-xl text-gray-600">{projectName}</h2>
        </div>
        
        <form onSubmit={addProduct} className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                ref={codeInputRef}
                name="code"
                type="text"
                value={newProduct.code}
                onChange={e => setNewProduct({...newProduct, code: e.target.value.toUpperCase()})}
                onKeyPress={e => handleKeyPress(e, 'code')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <input
                ref={descriptionInputRef}
                type="text"
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                onKeyPress={e => handleKeyPress(e, 'description')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade
              </label>
              <input
                ref={quantityInputRef}
                type="number"
                value={newProduct.quantity}
                onChange={e => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                onKeyPress={e => handleKeyPress(e, 'quantity')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                required
              />
            </div>
          </div>
          <button
            ref={submitButtonRef}
            type="submit"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Produto
          </button>
        </form>

        {products.length > 0 && (
          <>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Lista de Produtos</h2>
              <button
                onClick={exportCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.code}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => removeProduct(product.code)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;