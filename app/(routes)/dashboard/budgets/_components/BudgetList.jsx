"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { db } from '../../../../../utils/dbConfig'
import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
import { Budgets, Expenses } from '../../../../../utils/schema'
import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function BudgetList() {

  const { user } = useUser()
  const route = useRouter();
  const [budgetList, setBudgetList] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    user && getBudgetList();
  }, [user])


  const getBudgetList = async () => {
    try {
      setLoading(true);
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
          totalItem: sql`count(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .groupBy(Budgets.id)
        .orderBy(desc(Budgets.id));

      console.log("Fetched budgets:", result);
      setBudgetList(result);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='mt-7'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget refreshData={() => getBudgetList()} />
        {loading ? (
          [1, 2].map((item, index) => (
            <div key={index} className='w-full bg-slate-200 rounded-lg h-[150px] animate-pulse'>
            </div>)
          )) : budgetList.length > 0 ? (
            budgetList.map((budget, index) => (
              <BudgetItem budget={budget} key={index} />
            ))
          ) : (
          <div className="text-center text-primary text-lg flex items-center ml-9">No budgets here!  Begin your budgeting journey now!</div>
        )}
      </div>
    </div>
  )
}

export default BudgetList