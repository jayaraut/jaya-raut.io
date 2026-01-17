/**
 * Data Sync Component
 * Allows exporting and importing data to sync across devices
 */
function DataSync({ tasks, leetcodeTasks, profileImage, onImport }) {
    const [showSync, setShowSync] = React.useState(false);

    const exportData = () => {
        const data = {
            tasks,
            leetcodeTasks,
            profileImage,
            exportDate: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `portfolio-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    };

    const importData = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                onImport(data);
                alert('Data imported successfully! Refresh the page to see changes.');
            } catch (error) {
                alert('Error importing data. Please check the file format.');
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    const copyToClipboard = () => {
        const data = {
            tasks,
            leetcodeTasks,
            profileImage,
            exportDate: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(data);
        navigator.clipboard.writeText(jsonString);
        alert('Data copied to clipboard! Paste it on your other device.');
    };

    return (
        <>
            <button className="sync-button" onClick={() => setShowSync(!showSync)} title="Sync Data">
                🔄
            </button>

            {showSync && (
                <div className="sync-overlay" onClick={() => setShowSync(false)}>
                    <div className="sync-dialog" onClick={(e) => e.stopPropagation()}>
                        <div className="sync-header">
                            <h2>📱 Sync Your Data</h2>
                            <button className="close-button" onClick={() => setShowSync(false)}>✕</button>
                        </div>
                        
                        <div className="sync-content">
                            <div className="sync-section">
                                <h3>📤 Export Data</h3>
                                <p>Download your data to transfer to another device</p>
                                <button className="sync-action-btn" onClick={exportData}>
                                    💾 Download JSON File
                                </button>
                                <button className="sync-action-btn secondary" onClick={copyToClipboard}>
                                    📋 Copy to Clipboard
                                </button>
                            </div>

                            <div className="sync-divider"></div>

                            <div className="sync-section">
                                <h3>📥 Import Data</h3>
                                <p>Upload data from another device</p>
                                <label className="sync-upload-btn">
                                    📁 Choose JSON File
                                    <input 
                                        type="file" 
                                        accept=".json"
                                        onChange={importData}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                            </div>

                            <div className="sync-info">
                                <p>💡 <strong>How to sync:</strong></p>
                                <ol>
                                    <li>Export data on this device</li>
                                    <li>Send the file to your other device (email, cloud, etc.)</li>
                                    <li>Import the file on your other device</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
