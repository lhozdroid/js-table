# JSTable
JS + Bootstrap + Font-awesome data table utility

## How it works
Have your table defined in HTML
```html
<table id="table" class="table table-striped">
  <thead>
    <tr>
      <th>Edit</th>
      <th>Name</th>
      <th>SSN</th>
      <th>Company</th>
      <th>Profession</th>
      <th>Age</th>
      <th>Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <button class="btn btn-primary btn-sm">Edit</button>
      </td>
      <td>Ella Park</td>
      <td>705-27-4796</td>
      <td>Manpower Inc.</td>
      <td>Chiropractor</td>
      <td>76</td>
      <td>4/19/2047</td>
    </tr>
    <tr>
      <td>
        <button class="btn btn-primary btn-sm">Edit</button>
      </td>
      <td>Carrie Russell</td>
      <td>662-09-4944</td>
      <td>Pep Boys Manny, Moe &amp; Jack</td>
      <td>Gerontologist</td>
      <td>44</td>
      <td>4/28/2107</td>
    </tr>
  </tbody>
</table>
```
You can start adding properties to the html markup that will be understood by JSTables
### Header properties
Add these properties to the th elements in thead
- **data-id**: [string] - Give a unique identifier to the column
- **data-sort**: [true|false] - To indicate if the column can be sorted or not
- **data-filter**: [true|false] - To indicate if the column will be included in the filter criteria
- **data-type**: [string] - To indicate the type of data that the column will contain.  If not set it will be treated as **string**

#### Available data types
- **string**
- **number**
- **date**
- **button**
