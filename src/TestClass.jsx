import React from 'react'
import styled from 'styled-components'
import { useTable, usePagination } from 'react-table'

import makeData from './makeData'

//#region Styles
const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`
//#endregion

// Create an editable cell renderer
function EditableCell ({ 
                                                cell: { value: initialValue },
                                                row: { index },
                                                column: { id },
                                                updateMyData, // This is a custom function that we supplied to our table instance
                                            }) {

  constructor(porps) {
      super
  }
                                                
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue)

  onChange = e => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  onBlur = () => {
    updateMyData(index, id, value)
  }

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (<input value={value} onChange={onChange} onBlur={onBlur} />);
}

// Set our editable cell renderer as the default Cell renderer
const defaultColumn = {
  Cell: EditableCell,
}

// Be sure to pass our updateMyData and the disablePageResetOnDataChange option
 class Table extends React.Component({ columns, data, updateMyData, disablePageResetOnDataChange }) {
  // For this example, we're using pagination to illustrate how to stop
  // the current page from resetting when our data changes
  // Otherwise, nothing is different here.
  let {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      disablePageResetOnDataChange,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
    },
    usePagination
  )

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(
            (row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    )
                  })}
                </tr>
              )}
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

function EditableTableComponent() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName',
          },
          {
            Header: 'Last Name',
            accessor: 'lastName',
          },
        ],
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age',
          },
          {
            Header: 'Visits',
            accessor: 'visits',
          },
          {
            Header: 'Status',
            accessor: 'status',
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress',
          },
        ],
      },
    ],
    []
  )

  const [data, setData] = React.useState(() => makeData(20))
  const [originalData] = React.useState(data)
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnID and new value to update the
  // original data
  const updateMyData = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnID]: value,
          }
        }
        return row
      })
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data])

  const SaveData = (data) => {
    alert(JSON.stringify(data));
  }

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData)

  const saveData = () => saveData(data)

  return (
    <Styles>
      <button onClick={resetData}>Reset Data</button><nbsp/><nbsp/><nbsp/><nbsp/><button onClick={saveData}>Save Data</button>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        disablePageResetOnDataChange={skipPageReset}
      />
    </Styles>
  )
}

const EmissionsTableComponent = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'Year',
            accessor: 'year',
          },
          {
            Header: 'Chemical',
            accessor: 'chemical',
          },
          {
            Header: 'Tonnes per year',
            accessor: 'TPY'
          },
          {
            Header: 'Notes',
            accessor: 'notes'
          }
        ],
      }      
    ],
    []
  )

  const finalColumns = React.useMemo(
    () => [
      {
        Header: 'Calculated',
        columns: [
          {
            Header: 'Emissions Input',
            accessor: 'EI',
          },
          {
            Header: 'Year',
            accessor: 'year',
          },
          {
            Header: 'Notes',
            accessor: 'notes'
          },
          {
            Header: 'CO2',
            accessor: 'co2'
          },
          {
            Header: 'CH4_CO2e (TAR 100)',
            accessor: 'ch4_co2e'
          },
          {
            Header: 'N2O_CO2e (TAR 100)',
            accessor: 'n2o_co2e'
          }
        ],
      }      
    ],
    []
  )

  const [data, setData] = React.useState(() => props.data)//makeData('Emissions'))
  const [originalData] = React.useState(data)
  const [skipPageReset, setSkipPageReset] = React.useState(false)
  let FinalTable = false
  const finalData = JSON.parse('[{"EI":"2009","year":"CO2","notes":8,"co2":"relationship"}]')

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnID and new value to update the
  // original data
  const updateMyData = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnID]: value,
          }
        }
        return row
      })
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data]) 

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData)

  const saveData = () => {
    alert(JSON.stringify(data));
  }

  function GenerateTable() {
    alert(`It ran`)
    FinalTable = true;
    window.location.reload();
  }

    // if (FinalTable) {
    //   columns = finalColumns;
    //   data = finalData
    // }

  const checkColumns = () => {
    if (FinalTable) {
      return finalColumns;
    }
    else {
      return columns;
    }
  }

  const checkData = () => {
    if (FinalTable) {
      return finalData;
    } 
    else {
      return data;
    }
  }

  return (
    <Styles>
      <button onClick={resetData}>Reset Data</button>
      <nbsp/><nbsp/><nbsp/><nbsp/>
      <button onClick={saveData}>Save Data</button>
      <nbsp/><nbsp/><nbsp/><nbsp/>
      <button onClick={GenerateTable}>Generate Table</button>
      <Table
        // columns={columns }
        // data={data}
        columns={ FinalTable ? finalColumns : columns }
        data={ FinalTable ? finalData : data }
        updateMyData={updateMyData}
        disablePageResetOnDataChange={skipPageReset}
      />
    </Styles>
  )
}

const EnergyTableComponent = (props) => {
   
  const columns = React.useMemo(
    () => [
      {
        Header: 'Energy Data',
        columns: [
          {
            Header: 'Year',
            accessor: 'year',
          },
          {
            Header: 'Renewable Types',
            accessor: 'renewable',
          },
          {
            Header: 'Notes',
            accessor: 'notes'
          },
          {
            Header: 'Annual Total kWh',
            accessor: 'ATkWh'
          },
          {
            Header: 'Annual Reduction in Electricity Purchased from the Grid (kWh)',
            accessor: 'ARP'
          }
        ],
      }      
    ],
    []
  )

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //startDate={ this.state.startDate } endDate={ this.state.endDate } energyType={ this.state.selectedTypes } 
  //const [ startDate, endDate, energyType ] = props;

  alert('Start Date : ' + props.startDate + ' | ' + 'End Date : ' + props.endDate + ' | ' + 'Energy Type : ' + props.energyType);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


  const [data, setData] = React.useState(() => makeData('Energy'))
  const [originalData] = React.useState(data)
  const [skipPageReset, setSkipPageReset] = React.useState(false)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnID and new value to update the
  // original data
  const updateMyData = (rowIndex, columnID, value) => {
    // We also turn on the flag to not reset the page
    setSkipPageReset(true)
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnID]: value,
          }
        }
        return row
      })
    )
  }

  // After data chagnes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    setSkipPageReset(false)
  }, [data]) 

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => setData(originalData)

  const saveData = () => {
    makeData('Energy', data)
  }

  return (
    <Styles>
      <button onClick={resetData}>Reset Data</button><nbsp/><nbsp/><nbsp/><nbsp/><button on Click={saveData}>Save Data</button>
      <Table
        columns={columns}
        data={data}
        updateMyData={updateMyData}
        disablePageResetOnDataChange={skipPageReset}
      />
    </Styles>
  )
}

export { EditableTableComponent, EmissionsTableComponent, EnergyTableComponent }
