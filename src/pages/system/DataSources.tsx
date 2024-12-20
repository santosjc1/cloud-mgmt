import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Plus, Settings, Trash2 } from 'lucide-react';
import DataTable from '../../components/tables/DataTable';
import Modal from '../../components/modals/Modal';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import AddDataSourceForm from '../../components/forms/AddDataSourceForm';
import NSXConfigForm from '../../components/forms/NSXConfigForm';
import CiscoConfigForm from '../../components/forms/CiscoConfigForm';
import PaloAltoConfigForm from '../../components/forms/PaloAltoConfigForm';
import VCenterConfigForm from '../../components/forms/VCenterConfigForm';
import ThreeDotsMenu from '../../components/menus/ThreeDotsMenu';
import { fetchDataSources, createDataSource, updateDataSource, deleteDataSource } from '../../services/dataSourceService';
import type { DataSource, DataSourceConfig } from '../../types/dataSource';
import type { Region } from '../../types/region';

export default function DataSources() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<{
    id?: string;
    type: DataSource['type'];
    region: Region;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    dataSource: DataSource | null;
  }>({
    isOpen: false,
    dataSource: null,
  });

  useEffect(() => {
    loadDataSources();
  }, []);

  const loadDataSources = async () => {
    try {
      const sources = await fetchDataSources();
      setDataSources(sources);
    } catch (error: any) {
      toast.error('Error loading data sources: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Type', accessor: 'type', sortable: true },
    { header: 'Region', accessor: (ds: DataSource) => ds.region.name, sortable: true },
    { 
      header: 'Status', 
      accessor: (ds: DataSource) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          ds.status === 'connected' 
            ? 'bg-green-100 text-green-800'
            : ds.status === 'error'
            ? 'bg-red-100 text-red-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {ds.status === 'connected' ? 'Connected' : 
           ds.status === 'error' ? 'Error' : 'Not Configured'}
        </span>
      ),
      sortable: true,
      sortAccessor: (ds: DataSource) => ds.status
    },
    {
      header: '',
      accessor: (ds: DataSource) => (
        <div className="flex justify-end">
          <ThreeDotsMenu
            actions={[
              {
                label: 'Configure',
                icon: <Settings size={16} />,
                onClick: () => handleConfigure(ds)
              },
              {
                label: 'Delete',
                icon: <Trash2 size={16} />,
                onClick: () => handleDeleteClick(ds),
                variant: 'danger'
              }
            ]}
          />
        </div>
      )
    }
  ];

  const handleAddDataSource = (data: { type: DataSource['type'], region: Region }) => {
    setSelectedDataSource(data);
    setIsAddModalOpen(false);
    setIsConfigureModalOpen(true);
  };

  const handleConfigure = (dataSource: DataSource) => {
    setSelectedDataSource({
      id: dataSource.id,
      type: dataSource.type,
      region: dataSource.region
    });
    setIsConfigureModalOpen(true);
  };

  const handleDeleteClick = (dataSource: DataSource) => {
    setDeleteConfirmation({
      isOpen: true,
      dataSource,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.dataSource) return;

    setIsSubmitting(true);
    try {
      await deleteDataSource(deleteConfirmation.dataSource.id);
      await loadDataSources();
      toast.success('Data source deleted successfully');
      setDeleteConfirmation({ isOpen: false, dataSource: null });
    } catch (error: any) {
      toast.error('Error deleting data source: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateConfig = async (config: DataSourceConfig) => {
    if (!selectedDataSource) return;

    setIsSubmitting(true);
    try {
      if (selectedDataSource.id) {
        await updateDataSource(selectedDataSource.id, config);
      } else {
        await createDataSource(selectedDataSource.type, selectedDataSource.region.id, config);
      }
      
      await loadDataSources();
      setIsConfigureModalOpen(false);
      toast.success('Configuration updated successfully');
    } catch (error: any) {
      toast.error('Error updating configuration: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Sources</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          <span>Add Data Source</span>
        </button>
      </div>

      {dataSources.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No data sources</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new data source.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2 mx-auto rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Plus size={20} />
                <span>Add Data Source</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <DataTable columns={columns} data={dataSources} />
        </div>
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Data Source"
      >
        <AddDataSourceForm
          onSubmit={handleAddDataSource}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isConfigureModalOpen}
        onClose={() => setIsConfigureModalOpen(false)}
        title={`Configure ${selectedDataSource?.type} - ${selectedDataSource?.region.name}`}
      >
        {selectedDataSource?.type === 'NSX' && (
          <NSXConfigForm
            onSubmit={handleUpdateConfig}
            isSubmitting={isSubmitting}
            initialData={selectedDataSource.region}
          />
        )}
        {selectedDataSource?.type === 'Cisco' && (
          <CiscoConfigForm
            onSubmit={handleUpdateConfig}
            isSubmitting={isSubmitting}
          />
        )}
        {selectedDataSource?.type === 'Palo Alto' && (
          <PaloAltoConfigForm
            onSubmit={handleUpdateConfig}
            isSubmitting={isSubmitting}
          />
        )}
        {selectedDataSource?.type === 'vCenter' && (
          <VCenterConfigForm
            onSubmit={handleUpdateConfig}
            isSubmitting={isSubmitting}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ isOpen: false, dataSource: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Data Source"
        message={`Are you sure you want to delete the data source "${deleteConfirmation.dataSource?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isConfirming={isSubmitting}
      />
    </div>
  );
}