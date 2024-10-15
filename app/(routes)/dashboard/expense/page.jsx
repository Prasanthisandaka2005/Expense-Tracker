"use client"
import React, { useEffect, useState } from 'react'
import ExpensesListTable from '../expenses/_components/ExpensesListTable'
import { Budgets, Expenses } from '../../../../utils/schema'
import { db } from '../../../../utils/dbConfig'
import { desc, eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'

function Expense() {

    const [expensesList, setExpensesList] = useState([])
    const { user } = useUser()

    useEffect(() => {
        getAllExpenses();
    }, [user])


    const getAllExpenses = async () => {

        const result = await db.select({
            id: Expenses.id,
            name: Expenses.name,
            amount: Expenses.amount,
            createdAt: Expenses.createdAt
        }).from(Budgets).rightJoin(Expenses, eq(Budgets.id, Expenses.budgetId)).where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(Expenses.id))

        setExpensesList(result)
    }

    return (
        <div className='m-10'>
            {expensesList.length > 0 ? <ExpensesListTable expensesList={expensesList} refreshData={() => getAllExpenses()} /> : <h1 className='text-xl font-semibold text-gray-600 text-center'>
                No expenses found. Start adding some!
            </h1>}

        </div>
    )
}

export default Expense