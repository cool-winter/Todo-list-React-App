import React, {useState} from 'react';
import './App.css';

const Header = () => {
  return (
    <h1 className = "AppName">List</h1>
  )
}

const MarkDone = () => {
  const [isDone, setDone] = useState(false);
  const handleCheckboxChange = () => {
    setDone(!isDone)
  }
  return (
    <input class = "checkmark" type="checkbox" checked={isDone} onChange={handleCheckboxChange} />
  )
}

function Task({text, onDelete, onEdit}) {
  return(
    <li className = "task">
      <MarkDone />
      <div className="taskText">{text}</div>
      <div class="buttons">
        <EditTask onEdit = {onEdit} taskText = {text} />
        <DeleteTask onDelete={onDelete} />
      </div> 
    </li>
  )
}

const TaskList = ({taskList, onDelete, onEdit}) => {
  return (
    <ul className='taskList'>
      {taskList.map((task, index) => (
        <Task
          key = {index} 
          text = {task}  
          onDelete={() => onDelete(index)} 
          onEdit={(newTaskText) => onEdit(index, newTaskText)} />
      ))}
    </ul>
  )
}

const CreateNewTask = ({taskText, handleChange, handleAddTask}) => {
  const [showForm, setShowForm] = useState(false);

  const AddTask = () => {
    setShowForm(!showForm)
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddTask(event);
    setShowForm(!showForm);
  }
  return (
    <div>
      {showForm ? (
        <form className = "addTask" onSubmit = {handleSubmit}>
          <input type = "text" placeholder = "Enter a new todo..." value = {taskText} onChange = {handleChange}/>
          <button type = "submit" >Add</button>
        </form>
      ) : (
        <button onClick = {AddTask} className = "addTaskButton">+</button>
      )}
    </div>
  )
}

const DeleteTask = ({onDelete}) => {
  return (
    <button type = "button" onClick = {onDelete} className='delete-button'>Del</button>
  )
}
const EditTask = ({onEdit, taskText}) => {
  const [showForm, setShowForm] = useState(false);
  const [newTaskText, setNewTaskText] = useState(taskText);

  const editTask = () => {
    setShowForm(!showForm);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onEdit(newTaskText);
    setShowForm(!showForm);
  }

  return (
    <div>
      {showForm ? (
        <form onSubmit = {handleSubmit} className = "addTask">
          <input type = "text" value = {newTaskText} onChange = {(event) => setNewTaskText(event.target.value)} />
          <button type = "submit">Done</button>
        </form>
      ) : (
        <button type = "button" onClick = {editTask} className='edit-button'>Edit</button>
      )}
    </div> 
  )
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskText: "",
      taskList: []
    }
  }

  handleChange = (event) => {
    this.setState({taskText: event.target.value})
  }
  
  handleDeleteTask = (index) => {
    const updatedTaskList = [...this.state.taskList];
    updatedTaskList.splice(index, 1);
    this.setState({taskList: updatedTaskList});
  }

  handleEditTask = (index, newTaskText) => {
    const updatedTaskList = [...this.state.taskList];
    updatedTaskList[index] = newTaskText;
    this.setState({
      taskList: updatedTaskList,
      taskText: ""
    })
  }

  componentDidMount() {
    const savedTasks = localStorage.getItem('taskList');
    if (savedTasks) {
      this.setState({ taskList: JSON.parse(savedTasks) });
    }
  }

  componentDidUpdate() {
    localStorage.setItem('taskList', JSON.stringify(this.state.taskList));
  }

  render() {
    return (
      <div className = "container">
        <Header />
        <CreateNewTask 
          taskText = {this.state.taskText}
          handleChange = {this.handleChange}
          handleAddTask = {(event) => {
            event.preventDefault();
            const {taskText, taskList} = this.state;
            if (taskText.trim() !== "") {
              this.setState({
                taskList: [...taskList, taskText],
                taskText: ""
              })
            }
          }}
        />
        <TaskList taskList = {this.state.taskList} onDelete = {this.handleDeleteTask} onEdit = {this.handleEditTask} />
      </div>
    )
  }
}


export default App;