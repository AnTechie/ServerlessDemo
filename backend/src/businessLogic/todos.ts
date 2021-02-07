import * as uuid from 'uuid'
import {TodoItem} from '../models/TodoItem'
import {TodoAccess} from '../dataLayer/TodoAccess'
import { getUserId } from '../auth/utils';
import {CreateTodoRequest} from '../requests/CreateTodoRequest'
import { createLogger } from '../utils/logger'
import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';



const todoAccess=new TodoAccess()
const logger = createLogger('Create')

export async function getAllTodos(jwtToken:string):Promise<TodoItem[]>
{   
    logger.info("getAllTodos business layer invoked")
    return todoAccess.getAllTodos(getUserId(jwtToken));
}
export async function deleteTodo( jwtToken: string,todoId: string):Promise<void>
{   
    logger.info("getAllTodos business layer invoked")
     todoAccess.deleteTodo(getUserId(jwtToken),todoId);
     return
}

export async function createTodo(createTodoRequest:CreateTodoRequest,jwtToken:string):Promise<TodoItem>
{
    logger.info("Entered Create Todo business")
    logger.info(createTodoRequest)
   const todoId=uuid.v4()
   const userId=getUserId(jwtToken)
   logger.info(userId)

   const newItem={
    todoId:todoId,
    userId:userId,
    createdAt: new Date().toISOString(),
    dueDate:createTodoRequest.dueDate,
    name:createTodoRequest.name,
    done:false
} 
   return await todoAccess.createTodo(newItem)
}

export async function updateTodo(updateTodo:UpdateTodoRequest,jwtToken:string,todoId:string):Promise<TodoUpdate>
{
    logger.info("Entered Create Todo business")
    logger.info(updateTodo)

    const userId=getUserId(jwtToken)

    logger.info(userId)
  
    return await todoAccess.updateTodo(updateTodo,userId,todoId)
}
export async function getUploadUrl(imageId: string):Promise<string> {
    return await todoAccess.getUploadUrl(imageId);
  }