"use client"
import React, { useEffect, useState } from 'react'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
import { Budgets, Expenses } from '../../../utils/schema'
import { db } from '../../../utils/dbConfig'
import CardInfo from '../dashboard/_components/CardInfo'
import BarChartDashboard from '../dashboard/_components/BarChartDashboard'
import BudgetItem from '../dashboard//budgets/_components/BudgetItem'
import ExpensesListTable from './expenses/_components/ExpensesListTable'
import CreateBudget from './budgets/_components/CreateBudget'
import Image from 'next/image'

function Dashboard() {

  const { user } = useUser()

  useEffect(() => {
    user && getBudgetList();
  }, [user])


  const [budgetList, setBudgetList] = useState([])
  const [expensesList, setExpensesList] = useState([])


  const getBudgetList = async () => {

    const result = await db.select({
      ...getTableColumns(Budgets),

      totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
      totalItem: sql`count(${Expenses.id})`.mapWith(Number)
    })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id))
    getAllExpenses()
    setBudgetList(result)
  }

  useEffect(() => {
    console.log(budgetList)
  }, [getBudgetList])

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
    <div className='p-8'>
      <h2 className='font-bold text-3xl'>Hey {user?.fullName} ✌</h2>
      {budgetList.length > 0 ?
        <>
          <p className='text-gray-500 mt-5'>Here's what happening with your money, Lets Magnage your expenses</p>
          <CardInfo budgetList={budgetList} />
          <div className='grid grid-cols-1 md:grid-cols-3 mt-6 gap-5'>
            <div className='md:col-span-2'>
              <BarChartDashboard budgetList={budgetList} />
              <ExpensesListTable expensesList={expensesList} refreshData={() => getBudgetList()} />
            </div>
            <div className='grid gap-5'>
              <h2 className='font-bold text-lg'>Latest Budgets</h2>
              {budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))}
            </div>
          </div>
        </>
        : <div className='flex flex-col gap-10 mt-10'>
          <div>
            <h1 className="text-2xl font-bold text-primary">Start Creating Your Budgets</h1>
            <p className="text-gray-600 mt-5">
              Take control of your finances by setting up budgets for different categories.
              Track your spending, plan ahead, and achieve your savings goals. It's time to
              manage your money smarter!
            </p>
          </div>
          <div className='flex gap-10'>
            <Image src='/budget.avif'
              width={250}
              height={150}
              alt='budget planner'
              className='rounded-full'
            />
            <div className='w-full'>
              <CreateBudget refreshData={getBudgetList} />
            </div>
          </div>

        </div>
      }
    </div>
  )
}

export default Dashboard