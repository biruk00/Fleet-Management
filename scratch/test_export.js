const drivers = [
  { id: 1, name: 'John Doe', plate_no: '01234', trailer_no: 'T001', phone: '0123456789' },
  { id: 2, name: 'Jane Smith', plate_no: '56789', trailer_no: '', phone: '0987654321' }
];
const trucks = [
  { plate_no: '01234', status: 'active', current_location: 'NY' },
  { plate_no: '56789', status: 'idle', current_location: 'LA' }
];

function exportCsv(drivers, trucks) {
  const headers = ['Index', 'Name', 'Plate No', 'Trailer No', 'Phone', 'Truck Status', 'Location'];
  const rows = drivers.map((d, i) => {
    const truck = trucks.find(t => t.plate_no === d.plate_no);
    const values = [
      i + 1,
      d.name || '',
      d.plate_no || '',
      d.trailer_no || '',
      d.phone || '',
      truck?.status || '',
      truck?.current_location || ''
    ];
    const prefixed = values.map((v, idx) => {
      const header = headers[idx];
      if (['Plate No', 'Phone'].includes(header) && typeof v === 'string' && v.length > 0) {
        return `'${v}`;
      }
      return v;
    });
    return prefixed.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows].join('\n');
  console.log(csvContent);
}

exportCsv(drivers, trucks);
