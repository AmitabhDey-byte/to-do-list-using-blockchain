#![no_std]

use soroban_sdk::{contract, contractimpl, Env, Vec, String, symbol_short};

#[contract]
pub struct TodoContract;

#[contractimpl]
impl TodoContract {

    // Add a new task
    pub fn add_task(env: Env, task: String) {
        let key = symbol_short!("TASKS");

        let mut tasks: Vec<(String, bool)> = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        tasks.push_back((task, false));
        env.storage().instance().set(&key, &tasks);
    }

    // Get all tasks
    pub fn get_tasks(env: Env) -> Vec<(String, bool)> {
        let key = symbol_short!("TASKS");

        env.storage()
            .instance()
            .get(&key)
            .unwrap_or(Vec::new(&env))
    }

    // Mark task as completed
    pub fn complete_task(env: Env, index: u32) {
        let key = symbol_short!("TASKS");

        let mut tasks: Vec<(String, bool)> = env
            .storage()
            .instance()
            .get(&key)
            .unwrap_or(Vec::new(&env));

        if index < tasks.len() {
            let (task, _) = tasks.get(index).unwrap();
            tasks.set(index, (task, true));
            env.storage().instance().set(&key, &tasks);
        }
    }
}