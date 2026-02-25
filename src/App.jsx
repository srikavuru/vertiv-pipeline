import React, { useState, useEffect } from 'react';
import { Upload, X, Mail, Phone, Building, Edit2, Search, Download, Trash2, Copy, Star, Pin, FileText, Archive, RotateCcw, Settings, GripVertical } from 'lucide-react';

// Minimal empty default for first-time users only
const EMPTY_DEFAULT = {
  board1: {
    name: 'Main Board',
    type: 'recruitment',
    pinned: true,
    columns: {
      todo: { title: 'To Do', cards: [] },
      screen: { title: 'Screen', cards: [] },
      inProgress: { title: 'In Progress', cards: [] },
      done: { title: 'Done', cards: [] }
    },
    statusOptions: ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost']
  }
};

export default function PDFKanban() {
  // Core state
  const [boards, setBoards] = useState(null);
  const [archivedBoards, setArchivedBoards] = useState({});
  const [currentBoardId, setCurrentBoardId] = useState('board1');
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // UI modals
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [showNewBoardModal, setShowNewBoardModal] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [showStatusManager, setShowStatusManager] = useState(false);
  
  // Form state
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardType, setNewBoardType] = useState('recruitment');
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newStatusName, setNewStatusName] = useState('');
  const [newCardData, setNewCardData] = useState({
    clientName: '', companyName: '', email: '', phone: '', notes: '', followUpDate: '', status: 'New Lead'
  });
  
  // Editing state
  const [selectedCard, setSelectedCard] = useState(null);
  const [addCardColumn, setAddCardColumn] = useState(null);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editingStatusIndex, setEditingStatusIndex] = useState(null);
  const [showStatusMenu, setShowStatusMenu] = useState(null);
  
  // Drag and drop
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Notifications
  const [uploadNotification, setUploadNotification] = useState(null);

  // Helper to show temporary notification
  const notify = (message, duration = 3000) => {
    setUploadNotification(message);
    setTimeout(() => setUploadNotification(null), duration);
  };

  // Safe accessors
  const columns = boards?.[currentBoardId]?.columns || {};
  const statusOptions = boards?.[currentBoardId]?.statusOptions || ['New Lead', 'Contacted', 'Qualified'];

  // Safe column updater
  const safeSetColumns = (updater) => {
    setBoards(prev => {
      if (!prev || !prev[currentBoardId]) return prev;
      try {
        const newColumns = typeof updater === 'function' 
          ? updater(prev[currentBoardId].columns || {}) 
          : updater;
        return {
          ...prev,
          [currentBoardId]: { ...prev[currentBoardId], columns: newColumns }
        };
      } catch (e) {
        console.error('Error updating columns:', e);
        return prev;
      }
    });
  };

  // LOAD DATA - storage is the ONLY source of truth
  useEffect(() => {
    const loadData = async () => {
      try {
        const result = { value: localStorage.getItem('recruitment-boards-data') };
        
        if (result && result.value) {
          const savedData = JSON.parse(result.value);
          if (savedData.boards && Object.keys(savedData.boards).length > 0) {
            setBoards(savedData.boards);
            setArchivedBoards(savedData.archivedBoards || {});
            setCurrentBoardId(savedData.currentBoardId || Object.keys(savedData.boards)[0]);
            setHasLoaded(true);
            return;
          }
        }
        
        // No storage data - first time user
        setBoards(EMPTY_DEFAULT);
        setCurrentBoardId('board1');
        
      } catch (error) {
        console.error('Load error:', error);
        setBoards(EMPTY_DEFAULT);
        setCurrentBoardId('board1');
      } finally {
        setHasLoaded(true);
      }
    };
    loadData();
  }, []);

  // Load PDF.js library
  useEffect(() => {
    if (!window.pdfjsLib) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      };
      document.head.appendChild(script);
    }
  }, []);

  // SAVE DATA - save immediately when boards change
  useEffect(() => {
    if (!boards || !hasLoaded) return;
    try {
      localStorage.setItem('recruitment-boards-data', JSON.stringify({ 
        boards, 
        archivedBoards,
        currentBoardId,
        savedAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [boards, archivedBoards, currentBoardId, hasLoaded]);

  // Archive a board
  const archiveBoard = (boardId) => {
    if (!boardId || !boards[boardId]) return;
    const boardToArchive = boards[boardId];
    
    // Add to archived with timestamp
    setArchivedBoards(prev => ({
      ...prev,
      [boardId]: { ...boardToArchive, archivedAt: new Date().toISOString() }
    }));
    
    // Remove from active boards
    setBoards(prev => {
      const newBoards = { ...prev };
      delete newBoards[boardId];
      return newBoards;
    });
    
    // Switch to another board if we archived the current one
    if (currentBoardId === boardId) {
      const remainingBoards = Object.keys(boards).filter(id => id !== boardId);
      setCurrentBoardId(remainingBoards[0] || 'board1');
    }
    
    notify(`✓ Archived: ${boardToArchive.name}`);
  };

  // Restore an archived board
  const restoreBoard = (boardId) => {
    if (!boardId || !archivedBoards[boardId]) return;
    const boardToRestore = archivedBoards[boardId];
    
    // Remove archivedAt property
    const { archivedAt, ...cleanBoard } = boardToRestore;
    
    // Add back to active boards
    setBoards(prev => ({
      ...prev,
      [boardId]: cleanBoard
    }));
    
    // Remove from archived
    setArchivedBoards(prev => {
      const newArchived = { ...prev };
      delete newArchived[boardId];
      return newArchived;
    });
    
    setCurrentBoardId(boardId);
    setShowArchivedModal(false);
    notify(`✓ Restored: ${boardToRestore.name}`);
  };

  // Permanently delete archived board
  const deleteArchivedBoard = (boardId) => {
    if (!boardId || !archivedBoards[boardId]) return;
    const boardName = archivedBoards[boardId].name;
    
    setArchivedBoards(prev => {
      const newArchived = { ...prev };
      delete newArchived[boardId];
      return newArchived;
    });
    
    notify(`✓ Deleted: ${boardName}`);
  };

  // Status management for boards
  const addStatusOption = () => {
    if (!newStatusName.trim() || !currentBoardId) return;
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        statusOptions: [...(prev[currentBoardId].statusOptions || []), newStatusName.trim()]
      }
    }));
    setNewStatusName('');
  };

  const updateStatusOption = (index, newName) => {
    if (!newName.trim() || !currentBoardId) return;
    const oldStatus = statusOptions[index];
    
    // Update the status option
    setBoards(prev => {
      const newBoards = { ...prev };
      newBoards[currentBoardId].statusOptions[index] = newName.trim();
      
      // Update all cards that have this status
      Object.keys(newBoards[currentBoardId].columns).forEach(colId => {
        newBoards[currentBoardId].columns[colId].cards = newBoards[currentBoardId].columns[colId].cards.map(card => 
          card.status === oldStatus ? { ...card, status: newName.trim() } : card
        );
      });
      
      return newBoards;
    });
    setEditingStatusIndex(null);
  };

  const deleteStatusOption = (index) => {
    if (!currentBoardId || statusOptions.length <= 1) return;
    const statusToDelete = statusOptions[index];
    
    // Check if any cards use this status
    let cardsWithStatus = 0;
    Object.values(columns).forEach(col => {
      col.cards?.forEach(card => {
        if (card.status === statusToDelete) cardsWithStatus++;
      });
    });
    
    if (cardsWithStatus > 0 && !confirm(`${cardsWithStatus} card(s) have this status. Delete anyway?`)) {
      return;
    }
    
    setBoards(prev => ({
      ...prev,
      [currentBoardId]: {
        ...prev[currentBoardId],
        statusOptions: prev[currentBoardId].statusOptions.filter((_, i) => i !== index)
      }
    }));
  };

  // Card operations with safety checks
  const deleteCard = (columnId, cardId) => {
    if (!columnId || !cardId || !columns[columnId]) return;
    safeSetColumns(prev => ({
      ...prev,
      [columnId]: { ...prev[columnId], cards: (prev[columnId]?.cards || []).filter(c => c.id !== cardId) }
    }));
  };

  const togglePriority = (columnId, cardId) => {
    if (!columnId || !cardId || !columns[columnId]) return;
    safeSetColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        cards: (prev[columnId]?.cards || []).map(c => c.id === cardId ? { ...c, isPriority: !c.isPriority } : c)
      }
    }));
  };

  const updateCardStatus = (columnId, cardId, newStatus) => {
    if (!columnId || !cardId) { setShowStatusMenu(null); return; }
    safeSetColumns(prev => {
      if (!prev[columnId]) return prev;
      return {
        ...prev,
        [columnId]: {
          ...prev[columnId],
          cards: (prev[columnId]?.cards || []).map(c => c.id === cardId ? { ...c, status: newStatus } : c)
        }
      };
    });
    setShowStatusMenu(null);
  };

  // CRM Modal
  const openCRMModal = (card, columnId) => {
    if (!card || !columnId) return;
    try {
      setSelectedCard({ ...card, columnId });
      setShowCRMModal(true);
    } catch (e) {
      console.error('Error opening card:', e);
    }
  };

  const updateCardCRM = () => {
    if (!selectedCard || !selectedCard.columnId) { 
      setShowCRMModal(false); 
      setSelectedCard(null);
      return; 
    }
    
    try {
      const { columnId, ...cardData } = selectedCard;
      
      if (!boards?.[currentBoardId]?.columns?.[columnId]) {
        notify('✗ Could not save changes', 2000);
        setShowCRMModal(false);
        setSelectedCard(null);
        return;
      }

      setBoards(prev => ({
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: {
            ...prev[currentBoardId].columns,
            [columnId]: {
              ...prev[currentBoardId].columns[columnId],
              cards: (prev[currentBoardId].columns[columnId].cards || []).map(c => 
                c.id === cardData.id ? { ...cardData, title: cardData.title || cardData.clientName } : c
              )
            }
          }
        }
      }));
      setShowCRMModal(false);
      setSelectedCard(null);
    } catch (e) {
      console.error('Error saving card:', e);
      setShowCRMModal(false);
      setSelectedCard(null);
    }
  };

  // Drag and drop
  const handleDragStart = (e, card, columnId) => {
    setDraggedCard(card);
    setDraggedFrom(columnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetColumnId) => {
    e.preventDefault();
    
    // Handle column drop
    if (draggedColumn && draggedColumn !== targetColumnId) {
      reorderColumns(draggedColumn, targetColumnId);
      setDraggedColumn(null);
      return;
    }
    
    // Handle card drop
    if (!draggedCard || !draggedFrom || draggedFrom === targetColumnId) {
      setDraggedCard(null);
      setDraggedFrom(null);
      return;
    }
    safeSetColumns(prev => {
      const sourceCards = (prev[draggedFrom]?.cards || []).filter(c => c.id !== draggedCard.id);
      const targetCards = [...(prev[targetColumnId]?.cards || []), draggedCard];
      return {
        ...prev,
        [draggedFrom]: { ...prev[draggedFrom], cards: sourceCards },
        [targetColumnId]: { ...prev[targetColumnId], cards: targetCards }
      };
    });
    setDraggedCard(null);
    setDraggedFrom(null);
  };

  // Column drag handlers
  const handleColumnDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    setDraggedCard(null);
    setDraggedFrom(null);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
  };

  const reorderColumns = (draggedId, targetId) => {
    if (!draggedId || !targetId || draggedId === targetId) return;
    
    setBoards(prev => {
      if (!prev || !prev[currentBoardId]) return prev;
      
      const currentColumns = prev[currentBoardId].columns || {};
      const columnIds = Object.keys(currentColumns);
      
      const draggedIndex = columnIds.indexOf(draggedId);
      const targetIndex = columnIds.indexOf(targetId);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;
      
      // Reorder the column IDs
      const newOrder = [...columnIds];
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedId);
      
      // Rebuild columns object in new order
      const newColumns = {};
      newOrder.forEach(id => {
        newColumns[id] = currentColumns[id];
      });
      
      return {
        ...prev,
        [currentBoardId]: {
          ...prev[currentBoardId],
          columns: newColumns
        }
      };
    });
  };

  // Add card
  const addManualCard = () => {
    if (!newCardData.clientName.trim() || !addCardColumn) return;
    const newCard = {
      id: Date.now(),
      title: newCardData.clientName,
      ...newCardData,
      uploadDate: new Date().toLocaleDateString(),
      isPriority: false
    };
    safeSetColumns(prev => ({
      ...prev,
      [addCardColumn]: { ...prev[addCardColumn], cards: [...(prev[addCardColumn]?.cards || []), newCard] }
    }));
    setShowAddCardModal(false);
    setNewCardData({ clientName: '', companyName: '', email: '', phone: '', notes: '', followUpDate: '', status: 'New Lead' });
    setAddCardColumn(null);
  };

  // Add column
  const addColumn = () => {
    if (!newColumnTitle.trim()) return;
    const newId = 'col_' + Date.now();
    safeSetColumns(prev => ({ ...prev, [newId]: { title: newColumnTitle, cards: [] } }));
    setShowAddColumnModal(false);
    setNewColumnTitle('');
  };

  // Delete column
  const deleteColumn = (columnId) => {
    if (Object.keys(columns).length <= 1) return;
    safeSetColumns(prev => {
      const { [columnId]: _, ...rest } = prev;
      return rest;
    });
  };

  // Create board
  const createBoard = () => {
    if (!newBoardName.trim()) return;
    const boardId = 'board_' + Date.now();
    const defaultColumns = newBoardType === 'todo'
      ? { todo: { title: 'To Do', cards: [] }, done: { title: 'Done', cards: [] } }
      : { todo: { title: 'To Do', cards: [] }, screen: { title: 'Screen', cards: [] }, inProgress: { title: 'In Progress', cards: [] }, done: { title: 'Done', cards: [] } };
    
    setBoards(prev => ({
      ...prev,
      [boardId]: {
        name: newBoardName,
        type: newBoardType,
        pinned: false,
        columns: defaultColumns,
        statusOptions: newBoardType === 'todo' ? ['Low', 'Medium', 'High'] : ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed Won', 'Closed Lost']
      }
    }));
    setCurrentBoardId(boardId);
    setShowNewBoardModal(false);
    setNewBoardName('');
    setNewBoardType('recruitment');
  };

  // Backup
  const fullBackup = (e) => {
    if (e) e.preventDefault();
    if (!boards) return;
    
    try {
      let totalCards = 0;
      Object.values(boards).forEach(board => {
        Object.values(board.columns || {}).forEach(col => { 
          totalCards += (col.cards?.length || 0); 
        });
      });
      
      const backupData = {
        boards,
        archivedBoards,
        currentBoardId,
        exportDate: new Date().toISOString(),
        version: '2.0'
      };
      
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pipeline-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      const archivedCount = Object.keys(archivedBoards).length;
      notify(`✓ Backup: ${Object.keys(boards).length} boards${archivedCount ? `, ${archivedCount} archived` : ''}, ${totalCards} cards`);
    } catch (e) {
      console.error('Backup error:', e);
      notify('✗ Backup failed', 2000);
    }
  };

  // Export current board to CSV
  const exportCSV = () => {
    if (!boards || !currentBoardId || !boards[currentBoardId]) return;
    
    const board = boards[currentBoardId];
    const allCards = [];
    
    // Collect all cards with their column info
    Object.entries(board.columns || {}).forEach(([colId, column]) => {
      (column.cards || []).forEach(card => {
        allCards.push({
          Column: column.title,
          Name: card.title || card.clientName || '',
          Company: card.companyName || '',
          Email: card.email || '',
          Phone: card.phone || '',
          Status: card.status || '',
          'Follow-up Date': card.followUpDate || '',
          'Upload Date': card.uploadDate || '',
          Notes: (card.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')
        });
      });
    });
    
    if (allCards.length === 0) {
      notify('No cards to export', 2000);
      return;
    }
    
    // Create CSV content
    const headers = Object.keys(allCards[0]);
    const csvRows = [
      headers.join(','),
      ...allCards.map(card => 
        headers.map(h => `"${card[h]}"`).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${board.name.replace(/[^a-z0-9]/gi, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notify(`✓ Exported ${allCards.length} cards to CSV`);
  };

  // Import
  const importData = (e) => {
    if (!e?.target?.files?.[0]) return;
    const file = e.target.files[0];
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.boards && Object.keys(data.boards).length > 0) {
          setBoards(data.boards);
          setArchivedBoards(data.archivedBoards || {});
          setCurrentBoardId(data.currentBoardId || Object.keys(data.boards)[0]);
          notify(`✓ Imported ${Object.keys(data.boards).length} boards`);
        } else {
          notify('✗ No boards found in file', 2000);
        }
      } catch (err) {
        console.error('Import error:', err);
        notify('✗ Import failed - invalid JSON', 2000);
      }
    };
    reader.onerror = () => {
      notify('✗ Failed to read file', 2000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Resume Upload - extracts text from PDF and parses contact info
  const handleResumeUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setUploadNotification(`⏳ Processing ${files.length} resume${files.length > 1 ? 's' : ''}...`);
    
    // Check if PDF.js is loaded
    if (!window.pdfjsLib) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const firstColumnId = Object.keys(columns)[0];
    if (!firstColumnId) {
      notify('✗ No column to add cards', 2000);
      e.target.value = '';
      return;
    }
    
    const newCards = [];
    const results = [];
    
    for (const file of files) {
      try {
        let extractedName = '';
        let email = '';
        let phone = '';
        
        // Try PDF extraction if library is loaded
        if (window.pdfjsLib) {
          try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Get text with position info from first page
            const page = await pdf.getPage(1);
            const textContent = await page.getTextContent();
            
            // Sort items by vertical position (top to bottom)
            const sortedItems = textContent.items
              .filter(item => item.str && item.str.trim())
              .sort((a, b) => {
                const yDiff = b.transform[5] - a.transform[5];
                if (Math.abs(yDiff) > 5) return yDiff;
                return a.transform[4] - b.transform[4];
              });
            
            // Group items into lines
            const lines = [];
            let currentLine = [];
            let lastY = null;
            
            for (const item of sortedItems) {
              const y = item.transform[5];
              if (lastY === null || Math.abs(y - lastY) < 10) {
                currentLine.push(item.str);
              } else {
                if (currentLine.length > 0) lines.push(currentLine.join(' ').trim());
                currentLine = [item.str];
              }
              lastY = y;
            }
            if (currentLine.length > 0) lines.push(currentLine.join(' ').trim());
            
            // Get full text for email/phone extraction
            let fullText = lines.join(' ');
            for (let i = 2; i <= Math.min(pdf.numPages, 3); i++) {
              const p = await pdf.getPage(i);
              const tc = await p.getTextContent();
              fullText += ' ' + tc.items.map(item => item.str).join(' ');
            }
            
            // Extract email and phone
            const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            email = emailMatch ? emailMatch[0].toLowerCase() : '';
            
            const phoneMatch = fullText.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
            phone = phoneMatch ? phoneMatch[0] : '';
            
            // Extract name from first lines
            const skipPatterns = [
              /^(resume|cv|curriculum|vitae|contact|email|phone|address|summary|objective|experience|education|skills)/i,
              /^(linkedin|github|portfolio|website|www\.|http)/i,
              /^\d/, /@/, /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,
            ];
            
            for (let i = 0; i < Math.min(lines.length, 10); i++) {
              const line = lines[i].trim();
              if (line.length < 3 || line.length > 50) continue;
              if (skipPatterns.some(p => p.test(line))) continue;
              
              const words = line.split(/\s+/);
              if (words.length >= 1 && words.length <= 4) {
                const allWordsLookLikeName = words.every(word => 
                  /^[A-Za-z][a-z]*\.?$/.test(word) || /^[A-Za-z]{2,}$/.test(word) || /^[A-Z]\.$/.test(word)
                );
                if (allWordsLookLikeName) {
                  extractedName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                  break;
                }
              }
            }
          } catch (pdfErr) {
            console.warn('PDF parse error for', file.name, pdfErr);
          }
        }
        
        // Fallback to filename if no name extracted
        if (!extractedName) {
          extractedName = file.name
            .replace(/\.pdf$/i, '')
            .replace(/[_-]+/g, ' ')
            .replace(/resume|cv|curriculum|vitae/gi, '')
            .replace(/\d{4}/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          if (extractedName) {
            extractedName = extractedName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          }
        }
        
        if (!extractedName) extractedName = 'New Candidate';
        
        const newCard = {
          id: Date.now() + Math.random(),
          title: extractedName,
          clientName: extractedName,
          companyName: '',
          email: email,
          phone: phone,
          notes: `Resume: ${file.name}`,
          uploadDate: new Date().toLocaleDateString(),
          status: 'New Lead',
          isPriority: false,
          followUpDate: ''
        };
        
        newCards.push(newCard);
        results.push(extractedName);
        
      } catch (err) {
        console.error('Error processing', file.name, err);
        results.push(file.name.replace(/\.pdf$/i, ''));
      }
    }
    
    // Add all cards at once
    if (newCards.length > 0) {
      safeSetColumns(prev => ({
        ...prev,
        [firstColumnId]: { 
          ...prev[firstColumnId], 
          cards: [...(prev[firstColumnId]?.cards || []), ...newCards] 
        }
      }));
    }
    
    // Show summary
    if (results.length === 1) {
      notify(`✓ Added: ${results[0]}`, 4000);
    } else if (results.length > 1) {
      notify(`✓ Added ${results.length} candidates`, 4000);
    }
    
    e.target.value = '';
  };

  // Filter cards
  const filterCards = (cards) => {
    if (!cards) return [];
    return cards.filter(card => {
      const matchesSearch = !searchQuery || 
        card.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || card.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const sortCardsByPriority = (cards) => {
    if (!cards) return [];
    return [...cards].sort((a, b) => {
      if (a.isPriority && !b.isPriority) return -1;
      if (!a.isPriority && b.isPriority) return 1;
      return 0;
    });
  };

  // Copy to clipboard - use textarea fallback which works in iframes
  const copyToClipboard = (text) => {
    if (!text) return;
    
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    
    try {
      document.execCommand('copy');
      notify('✓ Copied!', 1500);
    } catch (err) {
      // Try modern API as fallback
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text)
          .then(() => notify('✓ Copied!', 1500))
          .catch(() => notify('✗ Copy failed', 1500));
      } else {
        notify('✗ Copy failed', 1500);
      }
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // Loading state
  if (!boards) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  const sortedBoards = Object.entries(boards).sort((a, b) => {
    if (a[1].pinned && !b[1].pinned) return -1;
    if (!a[1].pinned && b[1].pinned) return 1;
    return 0;
  });

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Notification */}
      {uploadNotification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg font-semibold ${
          uploadNotification.startsWith('✗') ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
        }`}>
          {uploadNotification}
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-gray-800 border-b border-gray-700">
        {/* Main header row */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-bold text-xl" style={{ color: '#E84E26' }}>Vertiv Pipeline</h1>
            <div className="h-6 w-px bg-gray-600" />
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-gray-700 text-white rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-[#E84E26]"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E84E26]"
            >
              <option value="all">All Statuses</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAddColumnModal(true)} className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors">
              + Column
            </button>
            <button onClick={() => setShowNewBoardModal(true)} style={{ backgroundColor: '#E84E26' }} className="px-3 py-1.5 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-colors">
              + Board
            </button>
            <button onClick={() => setShowStatusManager(true)} className="px-3 py-1.5 bg-gray-700 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center gap-1">
              <Settings className="w-4 h-4" />
              Statuses
            </button>
            <div className="h-6 w-px bg-gray-600 mx-1" />
            <label className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm cursor-pointer hover:bg-purple-700 transition-colors flex items-center gap-1 font-semibold">
              <FileText className="w-4 h-4" />
              Upload Resumes
              <input type="file" accept=".pdf" multiple onChange={handleResumeUpload} className="hidden" />
            </label>
            <div className="h-6 w-px bg-gray-600 mx-1" />
            <button 
              onClick={(e) => { e.stopPropagation(); fullBackup(e); }} 
              type="button"
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Backup
            </button>
            <button 
              onClick={exportCSV} 
              type="button"
              className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
            <label className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm cursor-pointer hover:bg-green-700 transition-colors flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Import
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
            {Object.keys(archivedBoards).length > 0 && (
              <button 
                onClick={() => setShowArchivedModal(true)}
                className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500 transition-colors flex items-center gap-1"
              >
                <Archive className="w-4 h-4" />
                Archived ({Object.keys(archivedBoards).length})
              </button>
            )}
          </div>
        </div>

        {/* Board tabs row */}
        <div className="px-4 pb-2 flex items-center gap-1 overflow-x-auto">
          {sortedBoards.map(([boardId, board]) => (
            <div key={boardId} className="relative group">
              <button
                onClick={() => setCurrentBoardId(boardId)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-t-lg text-sm font-medium whitespace-nowrap transition-all ${
                  boardId === currentBoardId 
                    ? 'bg-gray-900 text-white border-t-2' + ' border-[#E84E26]' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {board.pinned && <Pin className="w-3 h-3" />}
                {board.name}
                <span className="text-xs opacity-60">
                  ({Object.values(board.columns || {}).reduce((sum, col) => sum + (col.cards?.length || 0), 0)})
                </span>
              </button>
              {/* Archive button - visible on hover */}
              {Object.keys(boards).length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); archiveBoard(boardId); }}
                  className="absolute -top-1 -right-1 p-1 bg-gray-700 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  style={{ ':hover': { backgroundColor: '#E84E26' } }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#E84E26'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#374151'}
                  title="Archive board"
                >
                  <Archive className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-x-auto p-6">
          <div className="flex gap-4 h-full">
            {Object.entries(columns).map(([columnId, column]) => (
              <div
                key={columnId}
                draggable
                onDragStart={(e) => handleColumnDragStart(e, columnId)}
                onDragEnd={handleColumnDragEnd}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                }}
                onDrop={(e) => handleDrop(e, columnId)}
                className={`w-80 flex-shrink-0 bg-gray-800 rounded-xl flex flex-col max-h-full transition-all ${
                  draggedColumn === columnId ? 'opacity-50 scale-95' : ''
                } ${draggedColumn && draggedColumn !== columnId ? 'border-2 border-dashed border-gray-600' : ''}`}
              >
                {/* Column header - drag handle */}
                <div 
                  className="p-4 border-b border-gray-700 flex items-center justify-between cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-gray-500" />
                    {editingColumn === columnId ? (
                      <input
                        type="text"
                        defaultValue={column.title}
                        autoFocus
                        onBlur={(e) => {
                          safeSetColumns(prev => ({
                            ...prev,
                            [columnId]: { ...prev[columnId], title: e.target.value }
                          }));
                          setEditingColumn(null);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm font-semibold"
                        draggable={false}
                      />
                    ) : (
                      <h3 
                        className="text-white font-semibold select-none" 
                        onDoubleClick={() => setEditingColumn(columnId)}
                      >
                        {column.title} ({column.cards?.length || 0})
                      </h3>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setAddCardColumn(columnId); setShowAddCardModal(true); }}
                      className="p-1 text-gray-400 hover:text-white"
                      draggable={false}
                    >
                      <span className="text-lg">+</span>
                    </button>
                    {Object.keys(columns).length > 1 && (
                      <button 
                        onClick={() => deleteColumn(columnId)} 
                        className="p-1 text-gray-400 hover:text-red-400"
                        draggable={false}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {sortCardsByPriority(filterCards(column.cards)).map(card => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        handleDragStart(e, card, columnId);
                      }}
                      onDragEnd={() => {
                        setDraggedCard(null);
                        setDraggedFrom(null);
                      }}
                      onClick={(e) => {
                        // Don't open modal if we were dragging
                        if (draggedColumn || draggedCard) return;
                        openCRMModal(card, columnId);
                      }}
                      className={`bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-650 ${
                        card.isPriority ? 'ring-2 ring-yellow-500' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm truncate flex-1">{card.title}</h4>
                        <button
                          onClick={(e) => { e.stopPropagation(); togglePriority(columnId, card.id); }}
                          className="ml-2"
                        >
                          <Star className={`w-4 h-4 ${card.isPriority ? 'text-yellow-500 fill-yellow-500' : 'text-gray-500'}`} />
                        </button>
                      </div>
                      
                      {card.companyName && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
                          <Building className="w-3 h-3" />
                          <span className="truncate">{card.companyName}</span>
                        </div>
                      )}
                      
                      {card.email && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1 group">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              window.location.href = `mailto:${card.email}?subject=Opportunity at Vertiv`;
                            }}
                            className="truncate hover:text-blue-400 flex-1 text-left"
                          >
                            {card.email}
                          </button>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              e.preventDefault();
                              copyToClipboard(card.email); 
                            }}
                            className="p-1 text-gray-500 hover:text-white hover:bg-gray-600 rounded"
                            title="Copy email"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {card.phone && (
                        <div className="flex items-center gap-1 text-gray-400 text-xs mb-1 group">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <a
                            href={`tel:${card.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="truncate hover:text-green-400 flex-1"
                          >
                            {card.phone}
                          </a>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              e.preventDefault();
                              copyToClipboard(card.phone); 
                            }}
                            className="p-1 text-gray-500 hover:text-white hover:bg-gray-600 rounded"
                            title="Copy phone"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {card.status && (
                          <div className="relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setShowStatusMenu(showStatusMenu === card.id ? null : card.id); }}
                              style={{ backgroundColor: '#E84E26' }}
                              className="px-2 py-0.5 text-white text-xs rounded"
                            >
                              {card.status}
                            </button>
                            {showStatusMenu === card.id && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setShowStatusMenu(null); }} />
                                <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl z-50 py-1 min-w-32">
                                  {statusOptions.map(status => (
                                    <button
                                      key={status}
                                      onClick={(e) => { e.stopPropagation(); updateCardStatus(columnId, card.id, status); }}
                                      className="block w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-gray-700"
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                        
                        {card.followUpDate && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded">
                            {new Date(card.followUpDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                        <div className="flex items-center gap-1">
                          {card.email && (
                            <button
                              onClick={(e) => { 
                                e.stopPropagation();
                                e.preventDefault();
                                window.location.href = `mailto:${card.email}?subject=Opportunity at Vertiv`;
                              }}
                              className="p-1 text-gray-400 hover:text-blue-400"
                              title="Send email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {card.phone && (
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                e.preventDefault();
                                copyToClipboard(card.phone); 
                              }}
                              className="p-1 text-gray-400 hover:text-green-400"
                              title="Copy phone"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCard(columnId, card.id); }}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      {/* CRM Modal */}
      {showCRMModal && selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b-4 flex items-center justify-between" style={{ borderColor: '#E84E26' }}>
              <h2 className="text-xl font-bold">Edit Record</h2>
              <button onClick={() => { setShowCRMModal(false); setSelectedCard(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  value={selectedCard.title || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, title: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={selectedCard.email || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, email: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Phone</label>
                  <input
                    type="tel"
                    value={selectedCard.phone || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, phone: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Company</label>
                  <input
                    type="text"
                    value={selectedCard.companyName || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, companyName: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <select
                    value={selectedCard.status || ''}
                    onChange={(e) => setSelectedCard({...selectedCard, status: e.target.value})}
                    className="w-full px-3 py-2 border-2 rounded-lg"
                  >
                    <option value="">Select status</option>
                    {(statusOptions || []).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Follow-up Date</label>
                <input
                  type="date"
                  value={selectedCard.followUpDate || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, followUpDate: e.target.value})}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Notes</label>
                <textarea
                  value={selectedCard.notes || ''}
                  onChange={(e) => setSelectedCard({...selectedCard, notes: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border-2 rounded-lg"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={updateCardCRM} style={{ backgroundColor: '#E84E26' }} className="flex-1 py-2 text-white rounded-lg font-semibold hover:opacity-90">
                Save Changes
              </button>
              <button onClick={() => { setShowCRMModal(false); setSelectedCard(null); }} className="px-6 py-2 border-2 rounded-lg font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Card Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="px-6 py-4 border-b-4 flex items-center justify-between" style={{ borderColor: '#E84E26' }}>
              <h2 className="text-xl font-bold">Add Card</h2>
              <button onClick={() => setShowAddCardModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="text"
                placeholder="Name *"
                value={newCardData.clientName}
                onChange={(e) => setNewCardData({...newCardData, clientName: e.target.value})}
                className="w-full px-3 py-2 border-2 rounded-lg"
              />
              <input
                type="email"
                placeholder="Email"
                value={newCardData.email}
                onChange={(e) => setNewCardData({...newCardData, email: e.target.value})}
                className="w-full px-3 py-2 border-2 rounded-lg"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={newCardData.phone}
                onChange={(e) => setNewCardData({...newCardData, phone: e.target.value})}
                className="w-full px-3 py-2 border-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Company"
                value={newCardData.companyName}
                onChange={(e) => setNewCardData({...newCardData, companyName: e.target.value})}
                className="w-full px-3 py-2 border-2 rounded-lg"
              />
              <select
                value={newCardData.status}
                onChange={(e) => setNewCardData({...newCardData, status: e.target.value})}
                className="w-full px-3 py-2 border-2 rounded-lg"
              >
                {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="px-6 py-4 border-t flex gap-3">
              <button onClick={addManualCard} style={{ backgroundColor: '#E84E26' }} className="flex-1 py-2 text-white rounded-lg font-semibold hover:opacity-90">
                Add Card
              </button>
              <button onClick={() => setShowAddCardModal(false)} className="px-6 py-2 border-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Column Modal */}
      {showAddColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold mb-4">Add Column</h2>
            <input
              type="text"
              placeholder="Column name"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={addColumn} style={{ backgroundColor: '#E84E26' }} className="flex-1 py-2 text-white rounded-lg font-semibold hover:opacity-90">
                Add
              </button>
              <button onClick={() => setShowAddColumnModal(false)} className="px-6 py-2 border-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Board Modal */}
      {showNewBoardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-sm w-full p-6">
            <h2 className="text-xl font-bold mb-4">New Board</h2>
            <input
              type="text"
              placeholder="Board name"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg mb-4"
              autoFocus
            />
            <select
              value={newBoardType}
              onChange={(e) => setNewBoardType(e.target.value)}
              className="w-full px-3 py-2 border-2 rounded-lg mb-4"
            >
              <option value="recruitment">Recruitment Pipeline</option>
              <option value="todo">To-Do List</option>
            </select>
            <div className="flex gap-3">
              <button onClick={createBoard} style={{ backgroundColor: '#E84E26' }} className="flex-1 py-2 text-white rounded-lg font-semibold hover:opacity-90">
                Create
              </button>
              <button onClick={() => setShowNewBoardModal(false)} className="px-6 py-2 border-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archived Boards Modal */}
      {showArchivedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Archived Boards
              </h2>
              <button onClick={() => setShowArchivedModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {Object.keys(archivedBoards).length === 0 ? (
                <p className="text-gray-500 text-center py-8">No archived boards</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(archivedBoards).map(([boardId, board]) => {
                    const cardCount = Object.values(board.columns || {}).reduce((sum, col) => sum + (col.cards?.length || 0), 0);
                    return (
                      <div key={boardId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{board.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cardCount} cards • Archived {new Date(board.archivedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => restoreBoard(boardId)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restore
                          </button>
                          <button
                            onClick={() => deleteArchivedBoard(boardId)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <button onClick={() => setShowArchivedModal(false)} className="w-full py-2 border-2 rounded-lg hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Manager Modal */}
      {showStatusManager && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Manage Statuses
              </h2>
              <button onClick={() => setShowStatusManager(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Statuses for: <span className="font-semibold">{boards?.[currentBoardId]?.name}</span>
            </p>
            
            {/* Add new status */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addStatusOption()}
                placeholder="New status name..."
                className="flex-1 px-3 py-2 border-2 rounded-lg"
              />
              <button
                onClick={addStatusOption}
                className="px-4 py-2 text-white rounded-lg font-semibold hover:opacity-90"
                style={{ backgroundColor: '#E84E26' }}
              >
                Add
              </button>
            </div>
            
            {/* Status list */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {statusOptions.map((status, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  {editingStatusIndex === index ? (
                    <input
                      type="text"
                      defaultValue={status}
                      autoFocus
                      onBlur={(e) => updateStatusOption(index, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') updateStatusOption(index, e.target.value);
                        if (e.key === 'Escape') setEditingStatusIndex(null);
                      }}
                      className="flex-1 px-2 py-1 border-2 rounded"
                    />
                  ) : (
                    <>
                      <span className="flex-1 font-medium">{status}</span>
                      <button
                        onClick={() => setEditingStatusIndex(index)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {statusOptions.length > 1 && (
                        <button
                          onClick={() => deleteStatusOption(index)}
                          className="p-1 text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <button onClick={() => setShowStatusManager(false)} className="w-full py-2 border-2 rounded-lg hover:bg-gray-50">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
